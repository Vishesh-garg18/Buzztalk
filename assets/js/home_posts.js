{
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(".delete-post-button", newPost));
          new Noty({
            theme: "relax",
            text: "Post published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },

        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  let newPostDom = function (post) {
    return $(`<div class="posts-display" id="post-${post._id}">
    <h3>${post.user.name}</h3>
    <p class="post-content">${post.content}</p>
  
    <div class="post-btns">

    <a href="/likes/toggle/?id=${post._id}&type=Post" class="like-btn-link" data-likes="${post.likes.length}">
                <button class='like-post-btn' ><span id="like-count-${post._id}-Post">${post.likes.length}</span> &nbsp <i class="fas fa-heart"></i></button>
            </a>
      <button class="comments-btn" post-id="${post._id}">Comments</button>
      <% if (locals.user && locals.user.id == post.user.id) { %>
  
      <a class="delete-post-btn-link" href="/posts/destroy/${post._id}">
        <button class="delete-post-btn">Delete</button>
      </a>
      <% } %>
    </div>
  
    <div class="post-comments" id="comment-section-<%= post.id %>">
      <% if(locals.user){ %>
      <form
        action="/comments/create"
        method="POST"
        class="comment-form comment-form-preloaded"
        id="post-${post._id}-comment-form"
      >
        <input type="text" name="content" placeholder="Type Here" required />
        <input type="hidden" name="post" value="${post._id}" />
        <input type="submit" name="Add Comment" class="post-comment-btn" />
      </form>
      <% } %>
  
      <div class="'post-comments-list" id="post-comments-wrapper-${post._id}">
        <ul id="'post-comments-${post._id}">
          <% for(comment of post.comments) {%> <%- include('_comment') -%> <%} %>
        </ul>
      </div>
    </div>
  </div>
    `);
  };

  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Post Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  createPost();
}
