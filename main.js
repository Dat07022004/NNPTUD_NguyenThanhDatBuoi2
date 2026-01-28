//HTTP request get,get/id,post,put/id, delete/id
async function LoadData() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        let posts = await res.json()
        let body = document.getElementById("table-body");
        body.innerHTML = "";
        for (const post of posts) {
            // Áp dụng gạch ngang cho các post đã xoá mềm
            let style = post.isDeleted ? "style='text-decoration: line-through; opacity: 0.6;'" : "";
            body.innerHTML += `<tr ${style}>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td><input type='submit' value='delete' onclick='Delete(${post.id})' ${post.isDeleted ? "disabled" : ""}/></td>
            </tr>`
        }
        return false;
    } catch (error) {
        console.log(error);
    }

}//
async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;
    
    if (id) {
        // Nếu có ID -> cập nhật
        let getItem = await fetch("http://localhost:3000/posts/" + id);
        if (getItem.ok) {
            let post = await getItem.json();
            let res = await fetch('http://localhost:3000/posts/' + id,
                {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            ...post,
                            title: title,
                            views: views
                        }
                    )
                })
            if (res.ok) {
                console.log("edit du lieu thanh cong");
            }
        }
    } else {
        // Nếu không có ID -> tạo mới với ID tự tăng
        let allPosts = await fetch('http://localhost:3000/posts');
        let posts = await allPosts.json();
        let maxId = 0;
        for (const post of posts) {
            let postId = parseInt(post.id);
            if (!isNaN(postId) && postId > maxId) {
                maxId = postId;
            }
        }
        let newId = (maxId + 1).toString();
        
        let res = await fetch('http://localhost:3000/posts',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        id: newId,
                        title: title,
                        views: views,
                        isDeleted: false
                    }
                )
            })
        if (res.ok) {
            console.log("them du lieu thanh cong");
        }
    }
    LoadData();

}
async function Delete(id) {
    // Lấy thông tin bản ghi hiện tại
    let getItem = await fetch("http://localhost:3000/posts/" + id);
    if (getItem.ok) {
        let post = await getItem.json();
        // Xoá mềm bằng cách set isDeleted: true
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...post,
                isDeleted: true
            })
        });
        if (res.ok) {
            console.log("xoa mem thanh cong");
        }
    }
    LoadData();
}

// CRUD cho Comments
async function LoadComments() {
    try {
        let res = await fetch('http://localhost:3000/comments');
        let comments = await res.json();
        let body = document.getElementById("comment-table-body");
        body.innerHTML = "";
        for (const comment of comments) {
            // Áp dụng gạch ngang cho các comment đã xoá mềm
            let style = comment.isDeleted ? "style='text-decoration: line-through; opacity: 0.6;'" : "";
            body.innerHTML += `<tr ${style}>
                <td>${comment.id}</td>
                <td>${comment.text}</td>
                <td>${comment.postId}</td>
                <td><input type='button' value='edit' onclick='EditComment(${JSON.stringify(comment).replace(/'/g, "&apos;")})' ${comment.isDeleted ? "disabled" : ""}/></td>
                <td><input type='button' value='delete' onclick='DeleteComment("${comment.id}")' ${comment.isDeleted ? "disabled" : ""}/></td>
            </tr>`
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value;
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_postId_txt").value;
    
    if (id) {
        // Nếu có ID -> cập nhật
        let getItem = await fetch("http://localhost:3000/comments/" + id);
        if (getItem.ok) {
            let comment = await getItem.json();
            let res = await fetch('http://localhost:3000/comments/' + id,
                {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            ...comment,
                            text: text,
                            postId: postId
                        }
                    )
                })
            if (res.ok) {
                console.log("edit comment thanh cong");
                ClearCommentForm();
            }
        }
    } else {
        // Nếu không có ID -> tạo mới với ID tự tăng
        let allComments = await fetch('http://localhost:3000/comments');
        let comments = await allComments.json();
        let maxId = 0;
        for (const comment of comments) {
            let commentId = parseInt(comment.id);
            if (!isNaN(commentId) && commentId > maxId) {
                maxId = commentId;
            }
        }
        let newId = (maxId + 1).toString();
        
        let res = await fetch('http://localhost:3000/comments',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        id: newId,
                        text: text,
                        postId: postId,
                        isDeleted: false
                    }
                )
            })
        if (res.ok) {
            console.log("them comment thanh cong");
            ClearCommentForm();
        }
    }
    LoadComments();
}

async function DeleteComment(id) {
    // Lấy thông tin comment hiện tại
    let getItem = await fetch("http://localhost:3000/comments/" + id);
    if (getItem.ok) {
        let comment = await getItem.json();
        // Xoá mềm bằng cách set isDeleted: true
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...comment,
                isDeleted: true
            })
        });
        if (res.ok) {
            console.log("xoa mem comment thanh cong");
        }
    }
    LoadComments();
}

function EditComment(comment) {
    document.getElementById("comment_id_txt").value = comment.id;
    document.getElementById("comment_text_txt").value = comment.text;
    document.getElementById("comment_postId_txt").value = comment.postId;
}

function ClearCommentForm() {
    document.getElementById("comment_id_txt").value = "";
    document.getElementById("comment_text_txt").value = "";
    document.getElementById("comment_postId_txt").value = "";
}

LoadData();
LoadComments();
