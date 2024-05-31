document.getElementById('postForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    const postData = {
        title: title,
        content: content,
        date: new Date().toISOString()
    };

    fetch('https://api.github.com/repos/Tuedaysnah/texxttt/contents/posts.json', {
        method: 'GET',
        headers: {
            'Authorization': 'token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN',
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => {
        let sha = data.sha;
        let posts = JSON.parse(atob(data.content));
        posts.push(postData);
        let updatedContent = btoa(JSON.stringify(posts, null, 2));

        fetch('https://api.github.com/repos/Tuedaysnah/texxttt/contents/posts.json', {
            method: 'PUT',
            headers: {
                'Authorization': 'token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `New post: ${title}`,
                content: updatedContent,
                sha: sha
            })
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('statusMessage').innerText = 'Bài viết đã được đăng thành công!';
            } else {
                document.getElementById('statusMessage').innerText = 'Có lỗi xảy ra khi đăng bài viết.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('statusMessage').innerText = 'Có lỗi xảy ra khi đăng bài viết.';
        });
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('statusMessage').innerText = 'Có lỗi xảy ra khi lấy dữ liệu từ GitHub.';
    });
});
