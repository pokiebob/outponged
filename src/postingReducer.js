const reducePostings = (postings) => {
    const filtered = (postings ||[]).filter(x => x.postType === "post").reverse();
    
    return filtered.map((post, idx) => {
        const comments = postings.filter(x => x.ultimateParentPostId === post.postId);
        const date = new Date(post.date);
        return {
            ...post,
            comments,
            date: date.toLocaleDateString()
        }
    });
}

export default reducePostings;