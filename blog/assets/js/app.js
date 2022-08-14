let App = {};
const globalState = {
    posts: [],
    isLoading: false,
    errorMsg: ""
};
const app = document.getElementById("app");

const addRoutes = () => {
    /*$NB.addRoute("/books/:id", (params) => {
        console.log("Route is ", params.Title, params.id);
    }, "books");

    $NB.addRoute("/:category/:id", (params) => {
        console.log("Route is ", params.Title, params.category, params.id);
    }, "category");

    $NB.addRoute("/:category/:id/:action", (params) => {
        console.log("Route is ", params.Title, params.category, params.id, params.action);
    }, "category action");

    $NB.addRoute(["/", "/:pagename"], (params) => {
        console.log("Route is ", params.Title, params.pagename);
    }, "page");*/

    $NB.addRoute(["/", "/:pagename"], (params) => {
        if (params.pagename === undefined) {
            document.title = "Feed";
            app.innerHTML = ``;

            const feed = document.createElement("div");
            feed.className = "Feed";

            feed.appendChild(displayPosts());

            app.appendChild(feed);
        }
        else if (params.pagename === "about") {
            document.title = "About";
            app.innerHTML = `
                <div>BlogEngine native interface developed by Mohamed Touiti.</div>
            `;
        }
    }, "page");

    $NB.addRoute("/:category/:id", async (params) => {
        console.log("Route is ", params.Title, params.category, params.id);
        document.title = "Post";
        app.innerHTML = ``;

        if (params.category === "post") {
            const singlePost = await getSinglePost(params.id);
            document.title = singlePost.title;
            app.innerHTML = displayPostPage(singlePost);
        }
    }, "category");
};
App.navigateTo = (url) => {
    $NB.navigateTo(url);
};

const APP_URL = "http://localhost:3500/api";

const getSinglePost = async (postLink) => {
    let post;

    try
    {
        const response = await fetch(`${APP_URL}/posts/${postLink}`);
        post = await response.json();
    }
    catch (err)
    {
        globalState.errorMsg = err.message;
        console.log(globalState.errorMsg);
    }

    return post;
};

const displayPostPage = (post) => {
    const image = post.thumbnail ? `http://localhost:3500/images/${post.thumbnail}` : "/assets/images/placeholder.jpg";

    return `
        <article class="post">
            <div class="post__header">
                <h1>${post.title}</h1>
                <img src="${image}" alt="${post.title}" />
            </div>
            <div class="post__info">
                <p>At ${post.createdAt}</p>
                <p>
                    By <a href="/author/${post.userName}">${post.userName}</a>
                    ${post.tags.length ? "#" : ""}
                    ${post.tags.map(tag => {
                        return `<a href="/tags/${tag}">${tag}</a>`;
                    })}
                    <a href="/post/${post.link}#comments">(${post.commentsCount})</a>
                </p>
            </div>
            <p>
                ${post.content}
            </p>
        </article>

        <hr />
    `;
};

const postTemplate = (post) => {
    const image = post.thumbnail ? `http://localhost:3500/images/${post.thumbnail}` : "./assets/images/placeholder.jpg";
    let firstTwoTags = post.tags?.slice(0, 2);

    return `
        <article class="post">
            <div class="post__header">
                <a href="javascript:App.navigateTo('/post/${post.link}')">
                    <h1>${post.title}</h1>
                </a>
                <img src="${image}" alt="${post.title}" />
            </div>
            <div class="post__info">
                <p>At ${post.createdAt}</p>
                <p>
                    By <a href="/author/${post.userName}">${post.userName}</a>
                    ${firstTwoTags.length ? "#" : ""}
                    ${firstTwoTags.map(tag => {
                        return `<a href="/tags/${tag}">${tag}</a>`;
                    })}
                    <a href="/post/${post.link}#comments">(${post.commentsCount})</a>
                </p>
            </div>
            <p>
                ${post.content.slice(0, 100)}
            </p>
        </article>

        <hr />
    `;
};

const displayPosts = () => {
    if (globalState.errorMsg) {
        app.innerHTML = `
            <div style="color: red">
                ${globalState.errorMsg}
            </div>
        `;
        return;
    }

    if (globalState.isLoading) {
        app.innerHTML = `
            <div>
                Loading...
            </div>
        `;
        return;
    }
    
    const postsSection = document.createElement("section");
    globalState.posts.map(post => {
        const temp = postTemplate(post);
        postsSection.innerHTML += temp;
    });

    return postsSection;
};

const loadFeed = async () => {
    try
    {
        const response = await fetch(`${APP_URL}/posts`);
        globalState.posts = await response.json();
        console.log(globalState.posts);
    }
    catch (err)
    {
        globalState.errorMsg = err.message;
        console.log(globalState.errorMsg);
    }

    addRoutes();
    $NB.loadController(location.pathname);
    
    /*const feed = document.createElement("div");
    feed.className = "Feed";

    feed.appendChild(displayPosts());

    app.appendChild(feed);*/
};

document.addEventListener("DOMContentLoaded", loadFeed);
window.addEventListener("popstate", (e) => {
    $NB.loadController(location.pathname);
});