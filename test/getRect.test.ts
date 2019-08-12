import { getRect } from '../src';

describe('getRect', () => {
  it('can create a rect from a ClientRect', () => {
    const clientRect = {
      top: 10,
      bottom: 40,
      height: 30,
      left: 15,
      right: 45,
      width: 30,
    };

    const rect = getRect(clientRect);

    expect(rect.center).toEqual({
      x: 30,
      y: 25,
    });
  });
});

describe('rect.distance()', () => {
  it('can calculate the distance between two rects', () => {
    const rect1 = {
      top: 0,
      bottom: 10,
      height: 10,
      left: 0,
      right: 10,
      width: 10,
    };

    const rect2 = {
      top: 40,
      bottom: 50,
      height: 10,
      left: 30,
      right: 40,
      width: 10,
    };

    const distance = getRect(rect1).distance(rect2);

    expect(distance).toEqual(50);
  });
});

describe('rect.delta()', () => {
  it('can calculate the distance between two rects', () => {
    const rect1 = {
      top: 0,
      bottom: 10,
      height: 10,
      left: 0,
      right: 10,
      width: 10,
    };

    const rect2 = {
      top: 40,
      bottom: 50,
      height: 10,
      left: 30,
      right: 40,
      width: 10,
    };

    const distance = getRect(rect1).delta(rect2);

    expect(distance).toEqual({
      dx: 30,
      dy: 40,
    });

    const distance2 = getRect(rect1).delta(getRect(rect2));

    expect(distance2).toEqual({
      dx: 30,
      dy: 40,
    });
  });
});
