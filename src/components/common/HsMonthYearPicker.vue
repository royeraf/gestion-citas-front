<template>
    <div class="relative">
        <!-- Label -->
        <label v-if="label" :for="inputId" class="block text-xs font-medium text-gray-600 mb-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <!-- MonthYearPicker Input -->
        <div class="relative">
            <input ref="inputRef" :id="inputId" type="text" :value="displayValue" :placeholder="placeholder"
                :disabled="disabled" :readonly="readonly"
                class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none pr-8 cursor-pointer bg-white"
                :class="inputClasses" @click="togglePicker" @keydown.escape="closePicker" v-bind="$attrs" />

            <!-- Calendar Icon -->
            <div class="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                <CalendarIcon class="w-4 h-4 text-gray-400" />
            </div>
        </div>

        <!-- Error Message -->
        <span v-if="error" class="text-red-500 text-xs mt-1 block">{{ error }}</span>

        <!-- Month/Year Picker Dropdown - Teleported to body -->
        <Teleport to="body">
            <Transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="isOpen" ref="pickerRef"
                    class="fixed z-[9999] p-3 bg-white border border-gray-200 rounded-lg shadow-lg"
                    :style="pickerPosition">

                    <!-- Header with Year Navigation -->
                    <div class="flex items-center justify-between mb-2">
                        <button type="button" @click.stop="previousYear"
                            class="p-1 rounded hover:bg-gray-100 transition-colors text-gray-600">
                            <ChevronLeftIcon class="w-4 h-4" />
                        </button>

                        <select v-model="currentYear" @click.stop
                            class="px-2 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500 cursor-pointer">
                            <option v-for="year in yearRange" :key="year" :value="year">
                                {{ year }}
                            </option>
                        </select>

                        <button type="button" @click.stop="nextYear"
                            class="p-1 rounded hover:bg-gray-100 transition-colors text-gray-600">
                            <ChevronRightIcon class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Month Grid -->
                    <div class="grid grid-cols-3 gap-1">
                        <button v-for="(month, index) in monthNamesShort" :key="index" type="button"
                            :disabled="isMonthDisabled(index)" @click.stop="selectMonth(index)"
                            class="px-2 py-1.5 text-xs font-medium rounded transition-all duration-100"
                            :class="getMonthClasses(index)">
                            {{ month }}
                        </button>
                    </div>

                    <!-- Footer Actions -->
                    <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <button type="button" @click.stop="selectCurrentMonth"
                            class="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">
                            Hoy
                        </button>
                        <button type="button" @click.stop="clearSelection"
                            class="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors">
                            Limpiar
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

interface Props {
    modelValue?: string; // Expected format: YYYY-MM
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    error?: string;
    minDate?: string; // YYYY-MM format
    maxDate?: string; // YYYY-MM format
    inputId?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: 'Seleccionar mes',
    disabled: false,
    readonly: true,
    required: false,
    inputId: `monthpicker-${Math.random().toString(36).substr(2, 9)}`
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'change', value: string): void;
}>();

// Refs
const inputRef = ref<HTMLInputElement | null>(null);
const pickerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const currentYear = ref(new Date().getFullYear());
const pickerPosition = ref<{ top: string; left: string; minWidth: string }>({
    top: '0px',
    left: '0px',
    minWidth: '200px'
});

// Constants
const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const monthNamesShort = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];



// Computed
const inputClasses = computed(() => {
    if (props.error) {
        return 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500';
    }
    return 'border-gray-300 hover:border-gray-400';
});

const displayValue = computed(() => {
    if (!props.modelValue) return '';

    const parts = props.modelValue.split('-');
    if (parts.length < 2) return props.modelValue;

    const year = parseInt(parts[0]!);
    const monthIndex = parseInt(parts[1]!) - 1;

    if (isNaN(year) || isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
        return props.modelValue;
    }

    return `${monthNames[monthIndex]} ${year}`;
});

const yearRange = computed(() => {
    const minYear = props.minDate ? parseInt(props.minDate.split('-')[0] || '2020') : 2020;
    const maxYear = props.maxDate ? parseInt(props.maxDate.split('-')[0] || '2030') : 2030;
    const years: number[] = [];
    for (let y = minYear; y <= maxYear; y++) {
        years.push(y);
    }
    return years;
});

const selectedYear = computed(() => {
    if (!props.modelValue) return null;
    const parts = props.modelValue.split('-');
    return parts[0] ? parseInt(parts[0]) : null;
});

const selectedMonth = computed(() => {
    if (!props.modelValue) return null;
    const parts = props.modelValue.split('-');
    return parts[1] ? parseInt(parts[1]) - 1 : null;
});

// Methods
function formatMonthValue(year: number, month: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function isMonthDisabled(monthIndex: number): boolean {
    const checkDate = formatMonthValue(currentYear.value, monthIndex);

    if (props.minDate && checkDate < props.minDate) {
        return true;
    }
    if (props.maxDate && checkDate > props.maxDate) {
        return true;
    }
    return false;
}

function getMonthClasses(monthIndex: number): string {
    const isSelected = selectedYear.value === currentYear.value && selectedMonth.value === monthIndex;
    const isCurrentMonth = new Date().getFullYear() === currentYear.value && new Date().getMonth() === monthIndex;
    const isDisabled = isMonthDisabled(monthIndex);

    if (isDisabled) {
        return 'text-gray-300 cursor-not-allowed bg-gray-50';
    }

    if (isSelected) {
        return 'bg-teal-500 text-white font-semibold hover:bg-teal-600 shadow-md';
    }

    if (isCurrentMonth) {
        return 'text-teal-600 font-semibold bg-teal-50 hover:bg-teal-100 ring-1 ring-teal-200';
    }

    return 'text-gray-700 hover:bg-gray-100';
}

function updatePickerPosition() {
    if (!inputRef.value) return;

    const rect = inputRef.value.getBoundingClientRect();
    const pickerHeight = 180;
    const pickerWidth = 200;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check if there's enough space below
    let top = rect.bottom + 4;
    if (top + pickerHeight > viewportHeight) {
        top = rect.top - pickerHeight - 4;
    }

    // Check horizontal position
    let left = rect.left;
    if (left + pickerWidth > viewportWidth) {
        left = viewportWidth - pickerWidth - 8;
    }

    pickerPosition.value = {
        top: `${top}px`,
        left: `${left}px`,
        minWidth: `${pickerWidth}px`
    };
}

function togglePicker() {
    if (props.disabled) return;

    if (isOpen.value) {
        closePicker();
    } else {
        openPicker();
    }
}

function openPicker() {
    if (props.disabled) return;

    if (props.modelValue) {
        const parts = props.modelValue.split('-');
        if (parts[0]) {
            currentYear.value = parseInt(parts[0]);
        }
    }

    updatePickerPosition();
    isOpen.value = true;
}

function closePicker() {
    isOpen.value = false;
}

function selectMonth(monthIndex: number) {
    if (isMonthDisabled(monthIndex)) return;

    const value = formatMonthValue(currentYear.value, monthIndex);
    emit('update:modelValue', value);
    emit('change', value);
    closePicker();
}

function selectCurrentMonth() {
    const today = new Date();
    const value = formatMonthValue(today.getFullYear(), today.getMonth());

    if (!isMonthDisabled(today.getMonth())) {
        emit('update:modelValue', value);
        emit('change', value);
    }
    closePicker();
}

function clearSelection() {
    emit('update:modelValue', '');
    emit('change', '');
    closePicker();
}

function previousYear() {
    if (currentYear.value > (yearRange.value[0] || 2020)) {
        currentYear.value--;
    }
}

function nextYear() {
    const maxYear = yearRange.value[yearRange.value.length - 1] || 2030;
    if (currentYear.value < maxYear) {
        currentYear.value++;
    }
}

function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;

    if (
        isOpen.value &&
        inputRef.value &&
        !inputRef.value.contains(target) &&
        pickerRef.value &&
        !pickerRef.value.contains(target)
    ) {
        closePicker();
    }
}

function handleScrollResize() {
    if (isOpen.value) {
        updatePickerPosition();
    }
}

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        const parts = newVal.split('-');
        if (parts[0]) {
            currentYear.value = parseInt(parts[0]);
        }
    }
});

onMounted(() => {
    document.addEventListener('click', handleClickOutside, true);
    window.addEventListener('scroll', handleScrollResize, true);
    window.addEventListener('resize', handleScrollResize);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside, true);
    window.removeEventListener('scroll', handleScrollResize, true);
    window.removeEventListener('resize', handleScrollResize);
});
</script>

<style scoped>
select {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
}

select::-webkit-scrollbar {
    width: 4px;
}

select::-webkit-scrollbar-track {
    background: transparent;
}

select::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 2px;
}
</style>
