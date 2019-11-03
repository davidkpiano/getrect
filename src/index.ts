interface Coord {
  x: number;
  y: number;
}

interface Delta {
  dx: number;
  dy: number;
}

type RectListener = (rect: Rect) => void;

interface Subscription {
  unsubscribe(): void;
}

export class Rect implements ClientRect {
  public top!: number;
  public bottom!: number;
  public left!: number;
  public right!: number;
  public width!: number;
  public height!: number;
  public center!: Coord;
  public x!: number;
  public y!: number;
  public element?: Element;
  public timestamp!: number;
  private observers: Set<RectListener> = new Set();

  constructor(elementOrRect: Element | ClientRect) {
    this.update(elementOrRect);
  }

  public update(elementOrRect: Element | ClientRect): this {
    if (elementOrRect !== undefined || this.element !== undefined) {
      let clientRect: ClientRect;

      if (elementOrRect instanceof Element) {
        clientRect = elementOrRect.getBoundingClientRect();
        this.element = elementOrRect;
      } else if (elementOrRect !== undefined) {
        clientRect = elementOrRect;
      } else {
        clientRect = this.element!.getBoundingClientRect();
      }

      const { top, bottom, left, right, width, height } = clientRect;

      const centerX = left + width / 2;
      const centerY = top + height / 2;

      Object.assign(this, {
        top,
        bottom,
        left,
        right,
        width,
        height,
        center: {
          x: centerX,
          y: centerY,
        },
        x: left,
        y: top,
        timestamp: Date.now(),
      });
    }

    this.observers.forEach(observer => observer(this));

    return this;
  }

  public subscribe(observer: RectListener): Subscription {
    this.observers.add(observer);

    observer(this);

    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      },
    };
  }

  public distance(rect: Coord | ClientRect): number {
    const { x, y } = toCoord(rect);
    return Math.hypot(x - this.x, y - this.y);
  }

  public delta(rect: Coord | ClientRect): Delta {
    const { x, y } = toCoord(rect);

    return {
      dx: x - this.x,
      dy: y - this.y,
    };
  }

  public relativeTo(element: string | Element): Rect;
  public relativeTo(rect: Rect | ClientRect): Rect;
  public relativeTo(elementOrRect: string | Element | Rect | ClientRect) {
    const relativeRect = getRect(elementOrRect);

    return new Rect({
      top: this.top - relativeRect.top,
      bottom: this.bottom,
      left: this.left - relativeRect.left,
      right: this.right,
      width: this.width,
      height: this.height,
    });
  }
}

function toCoord(element: string | Element | Rect | ClientRect | Coord): Coord {
  if (typeof element !== 'string' && 'x' in element) {
    return element;
  }

  const rect = getRect(element);

  return {
    x: rect.left,
    y: rect.top,
  };
}

export function getElement(
  el: string | Element
): typeof el extends Element ? Element : Element | null {
  if (el instanceof Element) {
    return el;
  }

  return document.querySelector(el);
}

export function getRect(element: string | Element | Rect | ClientRect) {
  if (element instanceof Rect) {
    return element;
  }

  if (typeof element === 'string' || element instanceof Element) {
    const el = getElement(element);

    if (!el) {
      throw new Error(
        `Cannot get rect of element that does not exist: ${element.toString()}`
      );
    }

    return new Rect(el);
  }

  return new Rect(element);
}
