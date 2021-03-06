const { macacaHelper } = window;
const { domEvent, helper: eventHelper } = window._macaca_simulate;
const { assert } = macacaHelper;

describe('test/base.test.js', () => {
  describe('domEvent', () => {
    let container;
    let valueToChange;
    beforeEach(() => {
      valueToChange = null;
      container = document.querySelector('#mocha');
    });
    after(() => {});

    it('click', async () => {
      container.onclick = () => {
        valueToChange = 'click';
      };
      domEvent(container, 'click', {});
      macacaHelper.assert(valueToChange === 'click', 'click should be triggered');
      await macacaHelper.sleep(100);
    });

    it('click when target is array', async () => {
      container.onclick = () => {
        valueToChange = 'click array';
      };
      domEvent([container], 'click', {});
      macacaHelper.assert(
        valueToChange === 'click array',
        'click should be triggered',
      );
      await macacaHelper.sleep(100);
    });

    it('click when target is null', async () => {
      container.onclick = () => {
        valueToChange = 'click null';
      };
      try {
        domEvent(null, 'click', {});
      } catch (e) {
        macacaHelper.assert(
          valueToChange === null,
          'click should not be triggered',
        );
      }
      await macacaHelper.sleep(100);
    });

    it('random', async () => {
      try {
        domEvent(container, 'random', {});
      } catch (e) {
        // do nothing
      }
      await macacaHelper.sleep(100);
    });

    it('touchstart', async () => {
      container.ontouchstart = () => {
        valueToChange = 'touchstart';
      };
      domEvent(container, 'touchstart', {});
      // https://github.com/electron/electron/issues/8725
      // macacaHelper.assert(
      //   valueToChange === 'touchstart',
      //   'touchstart should be triggered'
      // );
      await macacaHelper.sleep(100);
    });

    const keyTests = [
      {
        event: 'keyup',
        eventHandler: 'onkeyup',
      },
      {
        event: 'keydown',
        eventHandler: 'onkeydown',
      },
      {
        event: 'keypress',
        eventHandler: 'onkeypress',
      },
    ];

    keyTests.forEach(test => {
      const { event, eventHandler } = test;
      it(`handles ${event} event`, async () => {
        container[eventHandler] = () => {
          valueToChange = event;
        };
        domEvent(container, event, {});
        macacaHelper.assert(
          valueToChange === event,
          `${event} should be triggered`,
        );
        await macacaHelper.sleep(100);
      });
    });

    it('should be able to simulate KeyboardEvent.key', () => {
      let pressedKey;
      container.onkeyup = e => pressedKey = e.key;
      domEvent(container, 'keyup', { key: 'a' });
      macacaHelper.assert(pressedKey === 'a', 'a should be pressed');
    });

    it('mock wheel scroll on element', async () => {
      const element = document.createElement('div');
      element.style.width = '100px';
      element.style.height = '200px';
      element.style.overflow = 'auto';
      const childNode = document.createElement('div');
      childNode.style.width = '100px';
      childNode.style.height = '400px';
      element.appendChild(childNode);
      container.appendChild(element);
      domEvent(element, 'wheel', { deltaX: 0, deltaY: 200 });
      assert.equal(element.scrollTop, 0);
      domEvent(element, 'wheel', { deltaX: 0, deltaY: 200, elementScroll: true });
      assert.equal(element.scrollTop, 200);
    });

    it('mock input type file', async () => {
      const element = document.querySelector('#test-input');
      element.addEventListener(
        'change',
        e => {
          assert.equal(e.target.files.length, 2);
        },
        false,
      );

      domEvent(element, 'change', {
        data: {
          target: {
            files: [
              {
                file: 'file1.png',
              },
              {
                file: 'file2.jpg',
              },
            ],
          },
        },
      });
    });
  });

  describe('helper', () => {
    let input;
    let content;
    beforeEach(() => {
      input = document.createElement('input');
      content = document.createElement('div');
      content.contentEditable = true;
      container = document.querySelector('#mocha');
    });

    after(() => {});

    it('formInput', async () => {
      eventHelper.formInput(input, 'foo');
      assert.equal(input.value, 'foo');
    });

    it('elementInput', async () => {
      eventHelper.elementInput(content, 'foo');
      assert.equal(content.innerHTML, 'foo');
    });
  });
});
