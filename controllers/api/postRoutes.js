const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.post("/", withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id
        })
        return res.status(200).json(newPost)
    } catch(err) {
        res.status(400).json(err)
    }
})

router.delete("/:id", withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.params.user_id
            }
        })
        if(!postData) {
            return res.status(404).json({ message: "There is no post found with this id" })
        }
        return res.status(200).json(postData)
    } catch(err) {
        return res.status(500).json(err)
    }
})

module.exports = router