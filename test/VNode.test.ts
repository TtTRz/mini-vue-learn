import { Fragment, h } from '../src/index'

describe("h", () => {
  test("h_1", () => {
    const elementVNode = h('div', null, h('span'))
    expect(elementVNode).toEqual({
      _isVNode: true,
      flags: 1,
      tag: 'div',
      data: null,
      children: {
        _isVNode: true,
        flags: 1,
        tag: 'span',
        data: null,
        children: null,
        childrenFlags: 1,
        el: null
      },
      childrenFlags: 2,
      el: null
    })
  })
  test("h_2", () => {
    const fragmentVNode = h(Fragment, null, [
      h('td'), h('td')
    ])
    expect(fragmentVNode).toEqual({
      _isVNode: true,
      flags: 128, // VNodeFlags.FRAGMENT
      data: null,
      tag: Symbol(),
      children: [
        {
          _isVNode: true,
          flags: 1, // VNodeFlags.ELEMENT_HTML
          tag: 'td',
          data: null,
          children: null,
          childrenFlags: 1,  // ChildrenFlags.NO_CHILDREN
          key: '|0', // 自动生成的 key
          el: null
        },
        {
          _isVNode: true,
          flags: 1, // VNodeFlags.ELEMENT_HTML
          tag: 'td',
          data: null,
          children: null,
          childrenFlags: 1,  // ChildrenFlags.NO_CHILDREN
          key: '|1', // 自动生成的 key
          el: null
        }
      ],
      childrenFlags: 4, // ChildrenFlags.KEYED_VNODES
      el: null
    })
  })
})
