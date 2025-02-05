// datamanager.js
const path                      = require('path')
const { ipcRenderer, shell }           = require('electron')
const { SHELL_OPCODE }          = require('./ipcconstants')

/**
 * settings.js로 부터 deleteDataFiles함수를 호출받아 파일을 삭제하는 기능을 구현.
 * 함수 호출과 함께 받는 변수는 array로 들어오며, 변수이름은 dPath, dFile로 정의되어 있음.
 * 
 * dPath는 삭제할 파일 혹은 폴더의 경로를 나타내며, dFile의 값이 없을때는 dPath로 지정된 폴더를 삭제.
 * dFile은 삭제할 파일의 이름과 확장자를 나타내며, 이 값이 있을때는 dPath는 삭제하지않고, dPath안에 있는 dFile에 정의된 파일을 삭제함.
 * 
 * 삭제 시도후 실패시 false를 반환, 성공시 true를 반환한다.
 * 
 * 참고용 코드는 아래와 같음
 * 
 * const fs        = require('fs-extra')
 * const path      = require('path')
 * const { ipcRenderer, shell } = require('electron')
 * const { SHELL_OPCODE } = require('./ipcconstants')
 * exports.deleteDropinMod = async function(modsDir, fullName){
 *
 *    const res = await ipcRenderer.invoke(SHELL_OPCODE.TRASH_ITEM, path.join(modsDir, fullName))
 *
 *    if(!res.result) {
 *        shell.beep()
 *        console.error('Error deleting drop-in mod.', res.error)
 *        return false
 *    }
 *
 *    return true
 *}
 * 
 */
/**
 * Deletes specified files or folders.
 * 
 * This function is called from settings.js to delete files or folders. The function receives two arrays: 
 * `dPath` and `dFile`. 
 * 
 * - `dPath` represents the path of the file or folder to be deleted. If `dFile` is not provided, the folder 
 *   specified by `dPath` will be deleted.
 * - `dFile` represents the name and extension of the file to be deleted. If this value is provided, only the 
 *   file specified by `dFile` within the `dPath` will be deleted.
 * 
 * If the deletion attempt fails, the function returns `false`. If successful, it returns `true`.
 * 
 * @param {string[]} dPath - Array of paths to the files or folders to be deleted.
 * @param {string[]} [dFile] - Array of filenames to be deleted within the corresponding `dPath`. If not provided, 
 *                             the entire folder specified by `dPath` will be deleted.
 * @returns {Promise<boolean>} - Returns `true` if deletion is successful, otherwise `false`.
 */
exports.deleteDataFiles = async function(dPath, dFile) {
    for (let i = 0; i < dPath.length; i++) {
        if (dFile && dFile[i]) {
            // 파일 삭제
            const res = await ipcRenderer.invoke(SHELL_OPCODE.TRASH_ITEM, path.join(dPath[i], dFile[i]))
            if (!res.result) {
                shell.beep()
                console.error('Error deleting file.', res.error)
                return false
            }
        } else {
            // 폴더 삭제
            const res = await ipcRenderer.invoke(SHELL_OPCODE.TRASH_ITEM, dPath[i])
            if (!res.result) {
                shell.beep()
                console.error('Error deleting folder.', res.error)
                return false
            }
        }
    }
    return true
}