const router = require("express").Router()
const { User, Post } = require("../models")
const withAuth = require("../utils/auth")

router.get("/", async (req, res) => {
    try{
        //* Get all posts and join with user data from the user model
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ["name"],
                }
            ]
        })

        //* Arrange data so the template can be read
        const posts = postData.map((post) => post.get({ plain: true }))

        //* Arranged data and session flag is passed into the template
        res.render("homepage", {
            posts,
            logged_in: req.session.logged_in
        }) 
    } catch(err) {
        return res.status(500).json(err)
    }
})
//* Find single post
router.get("/post/:id", async (req, res) => {
    try{
        const postData = await Post.findByPk(req.params.id, {
            include: User,
            attributes: ["name"],
        })
//* The user has to be logged in in order for them to search for a post.
        const post = postData.get({ plain: true })
        res.render("post", {
            ...post,
            logged_in: req.session.logged_in
        })
    } catch (err) {
       return res.status(500).json(err)
    }
})
//* withAuth middleware prevents access to the route 
router.get("/dashboard", withAuth, async (req, res) => {
    try{
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ["password"] },
            include: [{ model: Post }],
        })

        const user = userData.get({ plain: true })
        res.render("dashboard", {
            ...user,
            logged_in: true 
        })
    } catch(err) {
       return res.status(500).json(err)
    }
})

router.get("login", (req, res) => {
//*  If the user is already logged in. Redirect them to their dashboard. If not, log the user in
    if(req.session.logged_in) {
       return res.redirect("/dashboard")
        
    }
    res.render("login")
})

module.exports = router