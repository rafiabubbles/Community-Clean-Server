// controllers/contributionsController.js
function ContributionsController(ContributionModel) {
  return {
    getContributions: async (req, res) => {
      const { issueId, email } = req.query;
      const filter = {};
      if (issueId) filter.issueId = issueId;
      if (email) filter.email = email;

      const contributions = await ContributionModel.getAll(filter);
      res.send(contributions);
    },

    createContribution: async (req, res) => {
      const data = req.body;
      data.email = req.user.email;
      const result = await ContributionModel.create(data);
      res.send({ success: true, data: result });
    }
  };
}

module.exports = ContributionsController;
