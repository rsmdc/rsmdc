/* eslint-disable vue/use-v-on-exact */
const fs = require('fs')
const { ripples, dirPath } = require('./constants')
const { uniqWith, isEqual } = require('lodash')

const getComponentStyleFileName = () => {
  return fs.readdirSync(`${dirPath}`, 'utf8').filter(file => file.match(/^(?!_)^(?!mixins).*.scss/g))[0]
}

const getComponentStyleFile = () => {
  const fileName = getComponentStyleFileName()
  return fs.readFileSync(`${dirPath}/${fileName}`, 'utf8')
}

const readFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8')
}

const readStyleDir = (dirPath) => {
  return fs.readdirSync(dirPath, 'utf8')
}

const extractMatchWords = (text, searchFormat) => {
  return text.match(searchFormat)
}

const extractDefaultThemeVariables = (nodeModulesPath) => {
  const themeFile = readFile(`${nodeModulesPath}/@rsmdc/theme/_variables.scss`)
  return extractMatchWords(themeFile, /\$rs-theme.*(?=:)/g)
}

const extractComponentVariableFiles = () => {
  return readStyleDir(dirPath).filter(file => extractMatchWords(file, /variable/g))
}

const extractComponentThemeVariables = () => {
  const files = extractComponentVariableFiles()
  const variableFilesTexts = files.map(file => readFile(`${dirPath}/${file}`))
  const themeVariables = variableFilesTexts.reduce((result, text) => {
    const variables = extractMatchWords(text, /(.*?)rs-theme(.*?);/g)
    if (variables) {
      variables.forEach((part, i) => {
        variables[i] = part.replace(/:(.*?);/g, '')
      })
      return result.concat(variables)
    }
  }, [])
  return themeVariables
}

const extractVariables = (nodeModulesPath) => {
  const defaultThemeVariables = extractDefaultThemeVariables(nodeModulesPath)
  const componentThemeVariables = extractComponentThemeVariables()

  return defaultThemeVariables.concat(componentThemeVariables)
}

const excludeThemeVariablesInScss = (sourceScss, variables) => {
  variables.forEach(variable => {
    const regExp = new RegExp(`\\${variable}`, 'g')
    sourceScss = sourceScss.replace(regExp, `'${variable}'`)
  })
  return sourceScss
}

const replaceCssInnerRippleValue = (css, target, value) => {
  const regExp = new RegExp(`var\\(${target}\\)`, 'g')
  return css.replace(regExp, value)
}


module.exports.styleScss = (nodeModulesPath) => {
  const sourceScss = getComponentStyleFile()
  const themeVariables = extractVariables(nodeModulesPath)

  return excludeThemeVariablesInScss(sourceScss, themeVariables)
}

module.exports.generateStyle = (sourceCss, styles) => {
  const files = extractComponentVariableFiles()
  const componentVariables = files.map(file => readFile(`${dirPath}/${file}`))[0].match(/\$.*(?=:)/g)
  let css = sourceCss

  const hostStyles = []
  const style = Object.entries(styles).reduce((result, [prop, value]) => {
    if(prop.match(/host-rs/)) {
      hostStyles.push([prop, value])
      return result
    }

    if(typeof value === 'object') {
      value = value[value.length-1]
    }
    const regExp = new RegExp(`${ripples.toString().replace(/,/g, '|')}`, 'g')
    if(value.match(regExp)) {
      css = replaceCssInnerRippleValue(css, prop, value)
    }

    prop = prop.match(/\$rs-theme/) ? prop.replace(/(.*?)(?=\$)/g, '') : prop
    value = value.match(/'\$/) || value.match(/"/) ? value.replace(/'|"/, '#{').replace(/'|"/, '}').replace('#{}', '""') : value
    if (value.match(/calc\(/)) {
      componentVariables.forEach(variable => {
        let regExp = new RegExp(`\\${variable}`, 'g')
        value = value.replace(regExp, `#{${variable}}`).replace()

        regExp = new RegExp(`#{#{\\${variable}}}`, 'g')
        value = value.replace(regExp, `#{${variable}}`).replace()
      })
    }
    result = `${result}\n ${prop}: ${value};`
    return result
  }, '')
  let clientStyle = `:root {\n${style}\n}`

  if (hostStyles.length > 0) {
    let styles = []

    hostStyles.forEach(([prop]) => {
      const className = prop.replace('--', '').replace(/--.*/, '')
      const sameHostStyles = hostStyles.filter(([p]) => {
        return p.match(className)
      })
      styles.push(sameHostStyles)
    })

    styles = uniqWith(styles, isEqual)

    const hostStyle = styles.reduce((result, sameStyles) => {
      const className = sameStyles[0][0].replace('--', '').replace(/--.*/, '')
      const styleText = sameStyles.reduce((res, [prop, value]) => {
        const property = prop.replace(/.*---/, '')
        res = `${res}${property}:${value}; `
        return res
      }, '')
      result = `${result}.${className} { ${styleText} }\n`
      return result
    }, '')

    clientStyle = `${clientStyle}\n\n${hostStyle}`
  }

  if (!fs.existsSync('./src/dist')) {
    fs.mkdirSync('./src/dist')
  }
  fs.writeFileSync(`./src/dist/result.css`, css)
  fs.writeFileSync(`./src/dist/client-style.scss`, clientStyle)
}