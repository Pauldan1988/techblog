const router = require("express").Router()
const { User, Post } = require("../models")
const withAuth = require("../utils/auth")

router.get("/", async (req, res) => {
    try{
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