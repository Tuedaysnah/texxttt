document.getElementById('postForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    const postData = {
        title: title,
        content: content,
        date: new Date().toISOString()
    };

    const owner = 'Tuedaysnah';
    const repo = 'texxttt';
    const path = 'posts.json';

    // Fetch the existing posts.json file from the repository
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`GitHub API response error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        let sha = data.sha;
        let posts = JSON.parse(atob(data.content));
        posts.push(postData);
        let updatedContent = btoa(JSON.stringify(posts, null, 2));

        // Update the posts.json file in the repository
        return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`, // Bỏ dòng này nếu không dùng token
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `New post: ${title}`,
                content: updatedContent,
                sha: sha
            })
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`GitHub API response error: ${response.status} ${response.statusText}`);
        }
        document.getElementById('statusMessage').innerText = 'Bài viết đã được đăng thành công!';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('statusMessage').innerText = `Có lỗi xảy ra: ${error.message}`;
    });
});
