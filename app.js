const express = require('express')
const flash = require('express-flash')
const session = require("express-session")
// const db = require("./config/database")
const repository = require("./data/repository")
const validatePostData = require("./utils/validatePostData")
const validateEditData = require("./utils/validateEditData")

const app = express()
const port = process.env.PORT || 3000

// try {
//     await db.authenticate()
//     console.log('Database Connected')
// } catch (err) {
//     console.error(err)
// }

require('dotenv').config()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: true
}))
app.use(flash())


app.get('/login', (req, res) => {
    res.status(200).render('layouts/main-layout', {
        title: 'Login',
        content: '../contents/login/index'
    })
})

app.get('/register', (req, res) => {
    res.status(200).render('layouts/main-layout', {
        title: 'Register',
        content: '../contents/register/index'
    })
})


app.get('/', async (req, res) => {
    res.status(200).render('layouts/main-layout', {
        title: 'Home',
        nav: true,
        content: '../contents/home/index'
    })
})

app.get('/posts', async (req, res) => {
    const posts = await repository.getAllPosts()
    if (posts !== null) {
        res.status(200).render('layouts/main-layout', {
            title: 'Posts',
            nav: true,
            content: '../contents/posts/index',
            posts: posts,
        })
    }
})

app.post('/posts/mine/delete/:id', async (req, res) => {
    await repository.deletePost(req.body.id)
    req.flash('successDelete', "Post deleted successfully")
    res.status(200).redirect('/posts/mine')
})

app.get('/posts/add', async (req, res) => {
    res.status(200).render('layouts/main-layout', {
        title: `Add Post`,
        content: '../contents/posts/add',
        message: req.flash('message')[0] || '',
        valid: req.flash('valid')[0],
        // responseAddPost: req.flash('responseAddPost')[0] || {}
    })
})

app.post('/posts/add', async (req, res) => {
    const { valid, statusCode, message, postData } = validatePostData(req.body.title, req.body.body, req.body.userId)
    if (valid) {
        const createPost = await repository.createPost(
            postData.title,
            postData.body,
            postData.userIdInt
        )

        if (createPost !== null) {
            req.flash('valid', valid)
            req.flash('message', message)
            // req.flash('responseAddPost', postData)
        }
    } else {
        req.flash('message', message)
    }
    res.status(statusCode).redirect('/posts/add')
})

app.get('/posts/mine/edit/:id', async (req, res) => {
    const post = await repository.getPostById(req.params.id)

    if (post !== null) {
        res.status(200).render('layouts/main-layout', {
            title: 'Edit Post',
            content: '../contents/posts/edit',
            postId: req.params.id,
            postTitle: post.title,
            postBody: post.body,
            message: req.flash('message')[0] || '',
            valid: req.flash('valid')[0],
            // responseAddPost: req.flash('responseAddPost')[0] || {}
        })
    }
})

app.post('/posts/mine/edit/:id', async (req, res) => {
    const { valid, message, postData } = validateEditData(req.body.title, req.body.body, req.body.userId, req.body.postId)
   console.log(req.body.delete)
    if (valid && req.body.delete !== "true") {
        const updatePost = await repository.updatePost(
            postData.title,
            postData.body,
            postData.userIdInt,
            postData.postIdInt
        )

        if (updatePost !== null) {
            req.flash('valid', valid)
            req.flash('message', message)
            // req.flash('responseAddPost', postData)
        }
    } else {
        req.flash('message', message)
    }
    res.status(200).redirect(`/posts/mine/edit/${req.params.id}`)
})

app.get('/posts/details/:id', async (req, res) => {
    const post = await repository.getPostById(req.params.id)
    const comments = await repository.getCommentsByPostId(req.params.id)
    if (post !== null && comments !== null) {
        res.status(200).render('layouts/main-layout', {
            title: `${post.username} | ${post.title}`,
            content: '../contents/posts/details',
            post: post,
            comments: comments,
        })
    }
})

app.get('/posts/mine', async (req, res) => {
    const posts = await repository.getUserPostsByUserId(1)
    res.status(200).render('layouts/main-layout', {
        title: 'My Post',
        content: '../contents/posts/mine',
        posts: posts,
        successDelete: req.flash('successDelete')[0] || ''
    })
})



app.get('/users', async (req, res) => {
    const users = await repository.getAllUsers()
    if (users !== null) {
        res.status(200).render('layouts/main-layout', {
            title: 'Users',
            nav: true,
            content: '../contents/users/index',
            users: users
        })
    }
})

app.get('/users/details/:id', async (req, res) => {
    const user = await repository.getUserById(req.params.id)
    if (user !== null) {
        res.status(200).render('layouts/main-layout', {
            title: `About ${user.username}`,
            content: '../contents/users/details',
            user: user,
        })
    }
})

app.listen(port, () => {
    console.log(`
        App is running...
        Listing to port : ${port}
        Can be accessed at http://localhost:${port}
    `)
})