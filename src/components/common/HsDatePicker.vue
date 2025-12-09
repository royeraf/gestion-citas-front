<template>
    <div class="relative">
        <!-- Label -->
        <label v-if="label" :for="inputId" class="block text-xs font-medium text-gray-600 mb-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <!-- Datepicker Input -->
        <div class="relative">
            <input ref="inputRef" :id="inputId" type="text" :value="displayValue" :placeholder="placeholder"
                :disabled="disabled" :readonly="readonly"
                class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none pr-8 cursor-pointer bg-white"
                :class="inputClasses" @click="toggleCalendar" @keydown.escape="closeCalendar" v-bind="$attrs" />

            <!-- Calendar Icon -->
            <div class="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                <CalendarIcon class="w-4 h-4 text-gray-400" />
            </div>
        </div>

        <!-- Error Message -->
        <span v-if="error" class="text-red-500 text-xs mt-1 block">{{ error }}</span>

        <!-- Calendar Dropdown - Teleported to body -->
        <Teleport to="body">
            <Transition enter-active-class="transition ease-out duration-150" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="isOpen" ref="calendarRef"
                    class="fixed z-[9999] p-3 bg-white border border-gray-200 rounded-lg shadow-lg"
                    :style="calendarPosition">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-2">
                        <button type="button" @click.stop="previousMonth"
                            class="p-1 rounded hover:bg-gray-100 transition-colors text-gray-600">
                            <ChevronLeftIcon class="w-4 h-4" />
                        </button>

                        <div class="flex items-center gap-1">
                            <!-- Month Select -->
                            <select v-model="currentMonth" @click.stop
                                class="px-1.5 py-0.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer">
                                <option v-for="(month, index) in monthNames" :key="index" :value="index">
                                    {{ month }}
                                </option>
                            </select>

                            <!-- Year Select -->
                            <select v-model="currentYear" @click.stop
                                class="px-1.5 py-0.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer">
                                <option v-for="year in yearRange" :key="year" :value="year">
                                    {{ year }}
                                </option>
                            </select>
                        </div>

                        <button type="button" @click.stop="nextMonth"
                            class="p-1 rounded hover:bg-gray-100 transition-colors text-gray-600">
                            <ChevronRightIcon class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Weekday Headers -->
                    <div class="grid grid-cols-7 gap-0.5 mb-1">
                        <div v-for="day in weekDays" :key="day"
                            class="text-center text-[10px] font-semibold text-gray-400 py-1">
                            {{ day }}
                        </div>
                    </div>

                    <!-- Calendar Days -->
                    <div class="grid grid-cols-7 gap-0.5">
                        <button v-for="(day, index) in calendarDays" :key="index" type="button"
                            :disabled="!day.isCurrentMonth || day.isDisabled" @click.stop="selectDate(day)"
                            class="w-7 h-7 text-xs rounded transition-all duration-100 relative flex items-center justify-center"
                            :class="getDayClasses(day)">
                            <span :class="{ 'opacity-30': !day.isCurrentMonth }">{{ day.day }}</span>

                            <!-- Today indicator -->
                            <span v-if="day.isToday && !day.isSelected"
                                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-emerald-500 rounded-full"></span>
                        </button>
                    </div>

                    <!-- Footer Actions -->
                    <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <button type="button" @click.stop="selectToday"
                            class="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                            Hoy
                        </button>
                        <button type="button" @click.stop="clearDate"
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
    modelValue?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    error?: string;
    minDate?: string;
    maxDate?: string;
    format?: 'yyyy-mm-dd' | 'dd/mm/yyyy' | 'mm/dd/yyyy';
    inputId?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: 'Seleccionar fecha',
    disabled: false,
    readonly: true,
    required: false,
    format: 'yyyy-mm-dd',
    inputId: `datepicker-${Math.random().toString(36).substr(2, 9)}`
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'change', value: string): void;
}>();

// Refs
const inputRef = ref<HTMLInputElement | null>(null);
const calendarRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const calendarPosition = ref<{ top: string; left: string; minWidth: string }>({
    top: '0px',
    left: '0px',
    minWidth: '224px'
});

// Constants
const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const monthNames = [
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

    const date = new Date(props.modelValue + 'T00:00:00');
    if (isNaN(date.getTime())) return props.modelValue;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    switch (props.format) {
        case 'dd/mm/yyyy':
            return `${day}/${month}/${year}`;
        case 'mm/dd/yyyy':
            return `${month}/${day}/${year}`;
        default:
            return `${year}-${month}-${day}`;
    }
});

const yearRange = computed(() => {
    const minYear = props.minDate ? new Date(props.minDate).getFullYear() : 1900;
    const maxYear = props.maxDate ? new Date(props.maxDate).getFullYear() : 2100;
    const years: number[] = [];
    for (let y = minYear; y <= maxYear; y++) {
        years.push(y);
    }
    return years;
});

interface CalendarDay {
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
    date: Date;
}

const calendarDays = computed((): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const firstDay = new Date(currentYear.value, currentMonth.value, 1);
    const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
    const startWeekday = firstDay.getDay();

    // Previous month days
    const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
        const date = new Date(currentYear.value, currentMonth.value - 1, prevMonthLastDay - i);
        days.push({
            day: prevMonthLastDay - i,
            isCurrentMonth: false,
            isToday: false,
            isSelected: false,
            isDisabled: true,
            date
        });
    }

    // Current month days
    const today = new Date();
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(currentYear.value, currentMonth.value, d);
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = props.modelValue === formatDateValue(date);
        const isDisabled = isDateDisabled(date);

        days.push({
            day: d,
            isCurrentMonth: true,
            isToday,
            isSelected,
            isDisabled,
            date
        });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let d = 1; d <= remainingDays; d++) {
        const date = new Date(currentYear.value, currentMonth.value + 1, d);
        days.push({
            day: d,
            isCurrentMonth: false,
            isToday: false,
            isSelected: false,
            isDisabled: true,
            date
        });
    }

    return days;
});

// Methods
function formatDateValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function isDateDisabled(date: Date): boolean {
    if (props.minDate) {
        const min = new Date(props.minDate);
        if (date < min) return true;
    }
    if (props.maxDate) {
        const max = new Date(props.maxDate);
        if (date > max) return true;
    }
    return false;
}

function getDayClasses(day: CalendarDay): string {
    if (!day.isCurrentMonth) {
        return 'text-gray-300 cursor-default';
    }

    if (day.isDisabled) {
        return 'text-gray-300 cursor-not-allowed';
    }

    if (day.isSelected) {
        return 'bg-emerald-500 text-white font-medium hover:bg-emerald-600';
    }

    if (day.isToday) {
        return 'text-emerald-600 font-medium bg-emerald-50 hover:bg-emerald-100';
    }

    return 'text-gray-700 hover:bg-gray-100';
}

function updateCalendarPosition() {
    if (!inputRef.value) return;

    const rect = inputRef.value.getBoundingClientRect();
    const calendarHeight = 280; // Reduced height
    const calendarWidth = 224;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check if there's enough space below
    let top = rect.bottom + 4;
    if (top + calendarHeight > viewportHeight) {
        top = rect.top - calendarHeight - 4;
    }

    // Check horizontal position
    let left = rect.left;
    if (left + calendarWidth > viewportWidth) {
        left = viewportWidth - calendarWidth - 8;
    }

    calendarPosition.value = {
        top: `${top}px`,
        left: `${left}px`,
        minWidth: `${calendarWidth}px`
    };
}

function toggleCalendar() {
    if (props.disabled) return;

    if (isOpen.value) {
        closeCalendar();
    } else {
        openCalendar();
    }
}

function openCalendar() {
    if (props.disabled) return;

    if (props.modelValue) {
        const date = new Date(props.modelValue + 'T00:00:00');
        if (!isNaN(date.getTime())) {
            currentMonth.value = date.getMonth();
            currentYear.value = date.getFullYear();
        }
    }

    updateCalendarPosition();
    isOpen.value = true;
}

function closeCalendar() {
    isOpen.value = false;
}

function selectDate(day: CalendarDay) {
    if (!day.isCurrentMonth || day.isDisabled) return;

    const value = formatDateValue(day.date);
    emit('update:modelValue', value);
    emit('change', value);
    closeCalendar();
}

function selectToday() {
    const today = new Date();
    if (!isDateDisabled(today)) {
        const value = formatDateValue(today);
        emit('update:modelValue', value);
        emit('change', value);
    }
    closeCalendar();
}

function clearDate() {
    emit('update:modelValue', '');
    emit('change', '');
    closeCalendar();
}

function previousMonth() {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
    } else {
        currentMonth.value--;
    }
}

function nextMonth() {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
    } else {
        currentMonth.value++;
    }
}

function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;

    if (
        isOpen.value &&
        inputRef.value &&
        !inputRef.value.contains(target) &&
        calendarRef.value &&
        !calendarRef.value.contains(target)
    ) {
        closeCalendar();
    }
}

function handleScrollResize() {
    if (isOpen.value) {
        updateCalendarPosition();
    }
}

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        const date = new Date(newVal + 'T00:00:00');
        if (!isNaN(date.getTime())) {
            currentMonth.value = date.getMonth();
            currentYear.value = date.getFullYear();
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
