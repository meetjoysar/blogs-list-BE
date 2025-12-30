const dummy = (blogs) => {
    // ...
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        // console.log("sum", sum)
        // console.log("blog likes", blog.likes)
        return sum + blog.likes
    }
    // console.log("------")
    return blogs.length === 0
    ? 0 
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (fav_blog, current_blog) => {
        // first working way
        // console.log('---start---')
        // if (fav_blog.likes < current_blog.likes) {
        //     fav_blog = current_blog
        //     // console.log("fav_blog", fav_blog)
        //     // console.log("curr_blog", current_blog)
        //     return fav_blog
        // } 
        // return fav_blog
        return (fav_blog.likes < current_blog.likes) ? current_blog : fav_blog
    }
    // console.log('---end---')
    return blogs.length === 0
    ? {}
    : blogs.reduce(reducer, blogs[0])
}

module.exports = { dummy, totalLikes, favoriteBlog }