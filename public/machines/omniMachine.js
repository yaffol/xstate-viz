Machine({
    id: 'example',
    initial: 'leaf',
    states: {
        leaf: {
            on: {
                NEXT: 'compound'
            }
        },
        'another leaf': {
            entry: ['one', 'two'],
            exit: ['three', 'four'],
            on: {
                NEXT: {
                    target: 'compound',
                    cond: function someCondition() { return true }
                },
                NEVER: {
                    target: 'leaf',
                    cond: function falseCondition() { return false }
                }
            }
        },
        compound: {
            initial: 'child 1',
            states: {
                'child 1': {
                    on: {
                        NEXT: 'child 2'
                    }
                },
                'child 2': {
                    initial: 'subchild 1',
                    states: {
                        'subchild 1': {
                            on: { NEXT: 'subchild 2' }
                        },
                        'subchild 2': {
                            on: { NEXT: 'subchild 3', PREV: 'subchild 1' }
                        },
                        'subchild 3': {
                            type: 'final'
                        }
                    }
                }
            },
            on: {
                PREV: 'leaf',
                NEXT: 'parallel',
                INTERNAL: '.child 1'
            }
        },
        parallel: {
            type: 'parallel',
            states: {
                foo: {},
                bar: {
                    initial: 'one',
                    states: {
                        one: {
                            on: {
                                NEXT: 'two'
                            }
                        },
                        two: {
                            on: {
                                NEXT: 'three',
                                PREV: 'two'
                            }
                        },
                        three: {
                            on: {
                                SELF: 'three',
                                SELF_INTERNAL: '.',
                                PREV: 'two',
                                CYCLE: 'one'
                            }
                        }
                    }
                },
                baz: {
                    initial: 'one',
                    states: {
                        one: {
                            on: {
                                TWO_CHILD: 'two.foo'
                            }
                        },
                        two: {
                            initial: 'foo',
                            states: {
                                foo: {},
                                bar: {},
                                history: {
                                    type: 'history'
                                }
                            }
                        },
                        three: {}
                    }
                }
            }
        }
    }
})
