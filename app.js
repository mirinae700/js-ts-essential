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
  let template = `
    <div>
      <h1>{{__title__}}</h1>
      <div>
        <a href="#/page/{{__current_page__}}">목록으로</a>
      </div>
    </div>
  `;

  const newsContent = getData(CONTENT_URL.replace('@id', id));
  template = template.replace('{{__title__}}', newsContent.title);
  template = template.replace('{{__current_page__}}', store.currentPage);

  container.innerHTML = template;
}

function newsFeed() {
  const newsList = [];
  const newsFeed = getData(NEWS_URL);
  let template = `
    <div>
      <h1>Hacker News Feed</h1>
      <ul>
        {{__news_feed__}}
      </ul>
      <div>
        <a href="#/page/{{__prev_page__}}">이전 페이지</a>
      <a href="#/page/{{__next_page__}}">다음 페이지</a>
      </div>
    </div>
  `;

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <li>
        <a href="#/show/${newsFeed[i].id}">
          ${newsFeed[i].title} (${newsFeed[i].comments_count})
        </a>
      </li>
    `);
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace(
    '{{__prev_page__}}',
    store.currentPage > 1 ? store.currentPage - 1 : 1
  );
  template = template.replace(
    '{{__next_page__}}',
    store.currentPage * 10 === newsFeed.length
      ? store.currentPage
      : store.currentPage + 1
  );

  container.innerHTML = template;
}

window.addEventListener('hashchange', router);
router();
