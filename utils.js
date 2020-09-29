/**
 * @author Raul Novelo <raul.novelo@aaaimx.org>
 */
const ObjectsToCsv = require('objects-to-csv')
// Import the native fs module
const fs = require('fs')
const FILE_NAME = './asistencia.csv'
const GUILD_ID = '717803240959246497'

/**
 *
 * @param {Client} client Discord Client instance
 */
function getAllMembers (client) {
  // Get the Guild and store it under the variable "list"
  const guild = client.guilds.cache.get(GUILD_ID)
  const list = []
  // Iterate through the collection of GuildMembers from the Guild getting the username property of each member
  guild.members.cache.forEach(member => {
    // console.log(member.nickname || member.displayName)
    const roles = member.roles.cache.map(role => role.name)
    if (roles.includes('Trial')) {
      let fullname =
        member.nickname || member.displayName || member.user.username
      list.push({
        Apellidos: fullname.split(' ')[1],
        Nombre: fullname.split(' ')[0],
        Roles: roles.join(', ')
      })
    }
  })
  createCSV(list, 'trial.csv')
}

function getAllRoles (client) {
  // Get the Guild and store it under the variable "list"
  const guild = client.guilds.cache.get(GUILD_ID)
  // Iterate through the collection of GuildMembers from the Guild getting the username property of each member
  const roles = guild.roles.cache.sort(compare)
  return roles.map(r => r.name)
}

/**
 * Get user nickname (apodo)
 * @param {Client} client Discord Client instance
 * @param {User} user
 */
function getNickname (client, user) {
  let guild = client.guilds.get(GUILD_ID)
  member = guild.member(user)
  return member ? member.displayName : user.username
}

function compare (a, b) {
  if (a.id > b.id) {
    return 1
  }
  if (a.id < b.id) {
    return -1
  }
  // a must be equal to b
  return 0
}

/**
 *
 * @param {Array} elements
 */
async function createCSV (elements, fileName = FILE_NAME) {
  // If you use "await", code must be inside an asynchronous function:

  const csv = new ObjectsToCsv(elements)

  // Save to file:
  await csv.toDisk(fileName) // , { append: true }

  // Return the CSV file as string:
  const text = await csv.toString()

  // Get the buffer from the 'asistencia.csv', assuming that the file exists
  const buffer = fs.readFileSync(fileName)

  /**
   * Create the attachment using MessageAttachment,
   * overwritting the default file name to 'memes.txt'
   * Read more about it over at
   * http://discord.js.org/#/docs/main/master/class/MessageAttachment
   */
  return buffer
}

module.exports = {
  getNickname,
  createCSV,
  getAllMembers,
  getAllRoles
}
