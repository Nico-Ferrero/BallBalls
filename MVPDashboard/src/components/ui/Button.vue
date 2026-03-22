<script setup>
import { computed } from 'vue';
import { ArrowRight } from 'lucide-vue-next';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'outline', 'ghost', 'white'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  withArrow: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  }
});

const baseStyles = 'inline-flex items-center justify-center transition-all duration-200 font-semibold tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full';

const variants = {
  primary: 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white hover:shadow-lg hover:scale-[1.02]',
  outline: 'border border-gray-800 text-gray-800 hover:bg-gray-50 bg-transparent',
  ghost: 'text-gray-800 hover:bg-gray-100 bg-transparent',
  white: 'bg-white text-gray-800 hover:bg-gray-50 shadow-sm border border-gray-200',
};

const sizes = {
  sm: 'text-sm px-5 py-2.5',
  md: 'text-base px-7 py-3.5',
  lg: 'text-lg px-9 py-4',
};

const computedClasses = computed(() => {
  return `${baseStyles} ${variants[props.variant]} ${sizes[props.size]} ${props.class}`;
});
</script>

<template>
  <button :class="computedClasses" :disabled="disabled">
    <slot></slot>
    <ArrowRight v-if="withArrow" class="ml-2 h-4 w-4" />
  </button>
</template>
