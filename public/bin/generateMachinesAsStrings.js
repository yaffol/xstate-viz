const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

// const file = fs.readFile(path.join(__dirname, '../machines/authMachine.js'), 'utf8', (err, doc) => {
//   console.log(doc)
// })

const machinesPath = path.resolve(__dirname, '..', 'machines')
const templateFileName = 'machinesAsStrings.ejs'
const templatePath = __dirname
const templateFilePath = path.resolve(templatePath, templateFileName)
const outputPath = path.resolve(__dirname, '..', '..', 'src')
const outputFileName = 'examples.ts'
const outputFilePath = path.resolve(outputPath, outputFileName)

/**
 * @description Read files synchronously from a folder, with natural sorting
 * @param {String} dir Absolute path to directory
 * @returns {Object[]} List of object, each object represent a file
 * structured like so: `{ filepath, name, ext, stat }`
 */
function readFilesSync (dir) {
  const files = []

  const dirents = fs.readdirSync(dir, { withFileTypes: true })
  const direntFIles = dirents
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name)

  direntFIles.forEach(filename => {
    const name = path.parse(filename).name
    const ext = path.parse(filename).ext
    const filepath = path.resolve(dir, filename)
    const stat = fs.statSync(filepath)
    const isFile = stat.isFile()
    const content = fs.readFileSync(filepath, 'utf8')
    const machineRegexp = content.match(/(?<machinedefn>Machine\({[\s\S]+}\))/)
    const renderedContent = ejs.render(
      '<%- name %>: `<%- machine %>`',
      { name: name, machine: machineRegexp.groups.machinedefn }
    )

    if (isFile) files.push({ filepath, name, ext, stat, content, renderedContent })
  })

  files.sort((a, b) => {
    // natural sort alphanumeric strings
    // https://stackoverflow.com/a/38641281
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  })

  return files
}

const files = readFilesSync(machinesPath)

// console.log(files)

const templateString = fs.readFileSync(templateFilePath, 'utf8')

const machineStrings = files.map(file => file.renderedContent)

const renderedTemplate = ejs.render(templateString, { machineStrings })

fs.writeFileSync(outputFilePath, renderedTemplate, 'utf8')

// console.log(renderedTemplate)
