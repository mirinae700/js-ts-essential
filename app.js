const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

const store = {
  currentPage: 1,
};

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

function router() {
  const path = location.hash; // #만 있을 경우 빈값을 반환한다

  if (path === '') {
    newsFeed();
  } else if (path.indexOf('/page/') >= 0) {
    store.currentPage = Number(path.substring(7));
    newsFeed();
  } else {
    newsDetail();
  }
}

function newsDetail() {
  const id = location.hash.substring(7);

  const newsContent = getData(CONTENT_URL.replace('@id', id));

  container.innerHTML = `
  <h1>${newsContent.title}</h1>
  
  <div>
  <a href="#/page/${store.currentPage}">목록으로</a>
  </div>
  `;
}

function newsFeed() {
  const newsList = [];
  const newsFeed = getData(NEWS_URL);

  newsList.push('<ul>');

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <li>
      <a href="#/show/${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
      </li>
      `);
  }

  newsList.push('</ul>');

  // 페이징
  newsList.push(`
    <div>
      <a href="#/page/${
        store.currentPage > 1 ? store.currentPage - 1 : 1
      }">이전 페이지</a>
      <a href="#/page/${
        store.currentPage * 10 === newsFeed.length
          ? store.currentPage
          : store.currentPage + 1
      }">다음 페이지</a>
    </div>
    `);

  container.innerHTML = newsList.join('');
}

window.addEventListener('hashchange', router);
router();
