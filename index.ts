export const DOMUtil = {
  documentCache: window.document,
  bodyCache: window.document.body,
  headCache: window.document.head,
};

export const EPPZScrollTo = {
  documentVerticalScrollPosition() {
    if (self.pageYOffset) return self.pageYOffset;
    if (DOMUtil.documentCache.documentElement && DOMUtil.documentCache.documentElement.scrollTop)
      return DOMUtil.documentCache.documentElement.scrollTop;
    if (DOMUtil.documentCache.body.scrollTop) return DOMUtil.documentCache.body.scrollTop;
    return 0;
  },
  viewportHeight() {
    return DOMUtil.documentCache.compatMode === 'CSS1Compat'
      ? DOMUtil.documentCache.documentElement.clientHeight
      : DOMUtil.documentCache.body.clientHeight;
  },
  documentHeight() {
    return DOMUtil.documentCache.body.offsetHeight;
  },
  documentMaximumScrollPosition() {
    return this.documentHeight() - this.viewportHeight();
  },
  elementVerticalClientPositionById(id: string): number {
    const element = DOMUtil.documentCache.getElementById(id);
    const rectangle = element?.getBoundingClientRect();
    return rectangle?.top || 0;
  },
  scrollVerticalTickToPosition(currentPosition: any, targetPosition: any) {
    const filter = 0.2;
    const fps = 60;
    const difference = parseFloat(targetPosition) - parseFloat(currentPosition);
    const arrived = Math.abs(difference) <= 0.5;
    if (arrived) {
      scrollTo(0.0, targetPosition);
      return;
    }
    currentPosition =
      parseFloat(currentPosition) * (1.0 - filter) + parseFloat(targetPosition) * filter;
    scrollTo(0.0, Math.round(currentPosition));
    setTimeout(
      `EPPZScrollTo.scrollVerticalTickToPosition(${currentPosition}, ${targetPosition})`,
      1000 / fps
    );
  },
  scrollVerticalToElementById(id: string, padding: number) {
    const element = document.getElementById(id);
    if (element == null) {
      console.warn(`Cannot find element with id '${id}'.`);
      return;
    }
    let targetPosition =
      this.documentVerticalScrollPosition() + this.elementVerticalClientPositionById(id) - padding;
    const currentPosition = this.documentVerticalScrollPosition();

    const maximumScrollPosition = this.documentMaximumScrollPosition();
    if (targetPosition > maximumScrollPosition) targetPosition = maximumScrollPosition;
    this.scrollVerticalTickToPosition(currentPosition, targetPosition);
  },
};
