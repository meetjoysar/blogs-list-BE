const dummy = (blogs) => {
    // ...
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        console.log("sum", sum)
        console.log("blog likes", blog.likes)
        return sum + blog.likes
    }
    console.log("------")
    return blogs.length === 0
    ? 0 
    : blogs.reduce(reducer, 0)
}

module.exports = { dummy, totalLikes }