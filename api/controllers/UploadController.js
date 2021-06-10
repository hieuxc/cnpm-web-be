module.exports = {
  uploadImage: async (req, res) => {
    try {
      if (!req.files || !req.files.file) return res.json({ e: 1, m: 'Invalid params' })
      let result = await common.uploadFile(req.files.file)
      if (result && result.e) return res.json({ e: 1, m: 'error' })
      return res.json({ e: 0, data: result.data})
    } catch (error) {
      return res.json({ e: 1, m: error })
    }
  },
};