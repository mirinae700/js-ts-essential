const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

function router() {
  const path = location.hash; // #만 있을 경우 빈값을 반환한다

  if (path === '') {
    newsFeed();
  } else {
    newsDetail();
  }
}

function newsDetail() {
  const id = location.hash.substring(1);

  const newsContent = getData(CONTENT_URL.replace('@id', id));

  container.innerHTML = `
  <h1>${newsContent.title}</h1>
  
  <div>
  <a href="#">목록으로</a>
  </div>
  `;
}

function newsFeed() {
  const newsList = [];
  const newsFeed = getData(NEWS_URL);

  newsList.push('<ul>');

  for (let i = 0; i < 10; i++) {
    newsList.push(`
      <li>
      <a href="#${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
      </li>
      `);
  }

  newsList.push('</ul>');

  container.innerHTML = newsList.join('');
}

window.addEventListener('hashchange', router);
router();
