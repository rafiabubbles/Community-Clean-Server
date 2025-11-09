// controllers/issuesController.js
function IssuesController(IssueModel) {
  return {
    getAllIssues: async (req, res) => {
      const { limit, category, status, search } = req.query;
      const filter = {};
      if (category) filter.category = category;
      if (status) filter.status = status;
      if (search) filter.title = { $regex: search, $options: 'i' };

      const issues = await IssueModel.getAll(filter, parseInt(limit) || 0);
      res.json(issues);
    },

    getIssueById: async (req, res) => {
      const issue = await IssueModel.getById(req.params.id);
      res.send(issue);
    },

    createIssue: async (req, res) => {
      const data = req.body;
      data.email = req.user.email;
      const result = await IssueModel.create(data);
      res.send({ success: true, data: result });
    },

    updateIssue: async (req, res) => {
      const result = await IssueModel.update(req.params.id, req.body);
      res.send({ success: true, data: result });
    },

    deleteIssue: async (req, res) => {
      const result = await IssueModel.delete(req.params.id);
      res.send({ success: true, data: result });
    }
  };
}

module.exports = IssuesController;
