const Page = require('./helpers/page');

let page;


beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
})

afterEach(async () => {
  await page.close();
});

describe('When logged in', () => {

  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see blog create form', async () =>{
    const text = await page.getContentsOf('form label');

    expect(text).toEqual('Blog Title');
  });

  describe('When valid input', () =>{
    beforeEach(async() =>{
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });

    test('submitting takes user to review scren', async () =>{
      const text = await page.getContentsOf('h5');

      const title = await page.getContentsOf('form label+div');
      const content = await page.getContentsOf('form div + div label + div');

      expect(text).toEqual('Please confirm your entries');
      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    })

    test('submitting then saving adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    });
  });

  describe('When invalid input', () => {
    beforeEach(async ()=>{
      await page.click('form button');
    });
    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value')
      expect(contentError).toEqual('You must provide a value')
    });
  });
})

describe('When not logged in', () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'My Title',
        content: 'My Content'
      }
    }
  ];
  test('blog related actions are prohibited', async () => {
    const results = await page.execRequest(actions);

    for(let result of results){
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });

});
