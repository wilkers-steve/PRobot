const expect = require('expect');
const Configuration = require('../lib/configuration');
const Context = require('../lib/context');
const content = require('./fixtures/content/probot.json');
const payload = require('./fixtures/webhook/comment.created');

const createSpy = expect.createSpy;

content.content = new Buffer(`
  on("issues.opened")
    .comment("Hello World!")
    .assign("bkeepers");

  on("issues.closed")
    .unassign("bkeepers");
`).toString('base64');

describe('Configuration', () => {
  describe('include', () => {
    let github;
    let context;
    let config;

    beforeEach(() => {
      github = {
        repos: {
          getContent: createSpy().andReturn(Promise.resolve(content))
        }
      };
      context = new Context(github, {payload});
      config = new Configuration(context);
    });

    it('includes from the repo', () => {
      config.include('foo.js');
      expect(github.repos.getContent).toHaveBeenCalledWith({
        owner: 'bkeepers-inc',
        repo: 'test',
        path: 'foo.js'
      });
    });

    it('returns undefined', () => {
      expect(config.include('foo.js')).toBe(undefined);
    });

    it('includes from another repository', () => {
      config.include('atom/configs:foo.js#branch');
      expect(github.repos.getContent).toHaveBeenCalledWith({
        owner: 'atom',
        repo: 'configs',
        path: 'foo.js',
        ref: 'branch'
      });
    });
  });
});
