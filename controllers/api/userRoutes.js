const router = require("express").Router()
const { User, Post } = require("../../models")


//* Create a user
router.post("/", async (req, res) => {
    try {
        const userData = await User.create(req.body)

        //*Saves the users ID and logs them in after they sign up
        req.session.save(() => {
            req.session.user_id = userData.id
            req.session.logged_in = true

           return res.status(200).json(userData)
        })
    } catch (err) {
        res.status(400).json(err)
    }
})

router.post("/login", async (req, res) => {
    try {
    const userData = await User.findOne({ where: {email: req.body.email} })

    if (!userData) {
      return res.status(400).json({ message: "Your password or E-Mail was incorrect. Check spelling and try again" })
    }
    const correctPass = userData.checkPassword(req.body.password)

    if (!correctPass) {
      return res.status(400).json({ message: "Your password or E-Mail was incorrect. Check spelling and try again" })
    }    

    req.session.save(() => {
      req.session.user_id = userData.id
      req.session.logged_in = true

      res.json({ user: userData, message: "You are now logged in" })
    })
    } catch (err) {
    return res.status(400).json(err)
   }
})

router.post("/logout", (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
       return res.status(204).end()
      })
    } else {
     return res.status(404).end()
    }
  })

module.exports = router