import { h } from 'vue';

import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';

import { generatorId } from '../../utils';
import { uiConfig } from '../../install';

const AtRadioTableGroup = (props, { emit, slots }) => {
  return h(
    RadioGroup,
    {
      modelValue: props.modelValue,
      'onUpdate:modelValue': value => emit('update:modelValue', value),
    },
    {
      default: () => [
        h('div', { class: 'relative bg-white rounded-md -space-y-px' }, [
          props.items.map((item, itemIdx) => {
            return h(
              RadioGroupOption,
              {
                as: 'template',
                value: item[props.valueType],
              },
              {
                default: ({ checked, active }) => {
                  return h(
                    'div',
                    {
                      class: [
                        itemIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                        itemIdx === props.items.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                        checked
                          ? 'bg-' +
                            uiConfig.primaryBackgroundColor +
                            '-50 border-' +
                            uiConfig.primaryBorderColor +
                            '-200 z-10'
                          : 'border-gray-200',
                        'relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-' +
                          props.cols +
                          ' focus:outline-none',
                        {
                          'border-red-300 form-radio--error': props.error,
                          'border-green-500 form-radio--success': props.success,
                        },
                      ],
                    },
                    [
                      h('div', { class: 'flex items-center text-sm' }, [
                        h(
                          'span',
                          {
                            class: [
                              checked
                                ? 'bg-' + uiConfig.primaryBackgroundColor + '-600 border-transparent'
                                : 'bg-white border-gray-300',
                              active ? 'ring-2 ring-offset-2 ring-' + uiConfig.primaryBorderColor + '-500' : '',
                              'h-4 w-4 rounded-full border flex items-center justify-center',
                            ],
                            'aria-hidden': true,
                          },
                          [
                            h('span', {
                              class: 'rounded-full bg-white w-1.5 h-1.5',
                            }),
                          ]
                        ),
                        h(
                          RadioGroupLabel,
                          {
                            as: 'span',
                            class: [
                              checked ? 'text-' + uiConfig.primaryTextColor + '-900' : 'text-gray-900',
                              'ml-3 font-medium',
                            ],
                          },
                          { default: () => item.title }
                        ),
                      ]),
                      'columns' in slots
                        ? slots.columns({ columns: item.columns })
                        : item.columns.length
                        ? item.columns.map((col, colIdx) => {
                            return h(
                              RadioGroupDescription,
                              {
                                class: [
                                  'ml-6 pl-1 text-sm md:ml-0 md:pl-0',
                                  colIdx === item.columns.length - 1 ? 'md:text-right' : 'md:text-center',
                                  checked ? 'text-' + uiConfig.primaryTextColor + '-900' : '',
                                ],
                              },
                              { default: () => col.text }
                            );
                          })
                        : null,
                    ]
                  );
                },
              }
            );
          }),
        ]),
      ],
    }
  );
};

AtRadioTableGroup.props = {
  id: { type: String, default: () => generatorId('at-radio-') },
  valueType: { type: String, default: 'label' },
  items: { type: Array, required: true },
  noBorder: { type: Boolean, default: false },
  cols: { type: [Number, String], default: 3 },
  modelValue: {},
  error: { type: [Boolean, String, Number], default: false },
  success: { type: [Boolean, String, Number], default: false },
  disabled: { type: [Boolean, String, Number], default: false },
};
AtRadioTableGroup.emits = ['update:modelValue'];

export default AtRadioTableGroup;
