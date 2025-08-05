<script setup lang="ts">
import { computed, ref } from "vue";
// @ts-ignore
import Codemirror from "codemirror-editor-vue3";
// language
import "codemirror/mode/javascript/javascript.js";
// theme
import "codemirror/theme/idea.css"

const emit = defineEmits(['close', 'submit'])

const code = ref('')
const jsonCode = ref()
const isCodeInvalid = ref(false)

const cmOptions = {
  mode: {
    name: "javascript",
    json: true,
    statementIndent: 2
  },
  lineNumbers: false,
  theme: "idea",
}

const colorsToImport  = computed(() => {
  if (!jsonCode.value) {
    return []
  }

  return Object.keys(jsonCode.value).filter((colorName) => {
    return typeof jsonCode.value[colorName] === 'object'
  })
})

const close = () => {
  emit('close')
}

function stringToObject(str: string) {
  // Check if the input is a valid JSON string
  try {
    const parsed = JSON.parse(str);
    return parsed
  } catch (error) {
    // Not a valid JSON, assume it's a JavaScript object and normalize
    try {
      const normalized = str
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
        .replace(/'/g, '"')
        .replace(/,(\s*})/g, '$1'); // Remove trailing commas before closing curly brackets
      return JSON.parse(normalized); // Wrap the normalized string with curly braces to make it valid JSON
    }
    catch (_) {
      return null
    }
  }
}

const onChange = (value: string) => {
  isCodeInvalid.value = false

  if (!value.trim().startsWith("{")) {
    value = `{${value}`
  }

  if (!value.trim().endsWith("}")) {
    value = `${value}}`
  }

  try {
    jsonCode.value = stringToObject(value)
  }
  catch(_) {
    jsonCode.value = undefined
  }
}

const submit = () => {
  if (!jsonCode.value || !code.value) {
    isCodeInvalid.value = true
    return
  }

  const result: {
    [key: string]: object | string
  } = {}

  colorsToImport.value.forEach((colorName: string) => {
    const color = jsonCode.value[colorName]
    result[colorName] = color[500] || color
  })

  emit('submit', result)
  emit('close')
}
</script>
