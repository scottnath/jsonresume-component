/**
 * @fileoverview Fetches a remote resume.json file
 */

/**
 * Uses the GitHub rest API to fetch a resume.json gist's content
 * @param {string} gist_id
 * @returns {object} resume.json content
 * @see https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#get-a-gist
 */
export const getResumeJsonGist = async gist_id => {
  if (!gist_id) throw new Error('`gist_id` required')

  const ghApiGists = 'https://api.github.com/gists'

  const resp = await fetch(`${ghApiGists}/${gist_id}`)
  if (resp.message === 'Not Found') throw new Error(`Gist not found. Error: ${response}`)

  const response = await resp.json()

  if (!response.files['resume.json']) throw new Error(`resume.json not in gist ${gist_id}`)

  let content

  try {
    content = response.files['resume.json'].content
    content = JSON.parse(content)
  } catch (error) {
    throw new Error(`cannot parse resume.json content. Error: ${error}`)
  }

  return content
}

/**
 * Fetch a resume.json file from a URL
 * @param {string} json_url
 * @returns {object} resume.json content
 */
export const getResumeJsonUrl = async json_url => {
  if (!json_url) throw new Error('`json_url` required')

  const resp = await fetch(json_url)
  if (resp.error) throw new Error(`getResumeJsonUrl fetch error: ${response}`)

  const response = await resp.json()

  return response
}

/**
 * Gets resume.json content from a gist or a url and writes it to
 *  a resume.json file
 */
export const getResumeJson = async (gist_id, json_url) => {
  if (!gist_id && ! json_url)
    throw new Error('gist_id or json_url required');

  let resumejson;
  if (json_url) {
    resumejson = await getResumeJsonUrl(json_url)
  } else {
    resumejson = await getResumeJsonGist(gist_id)
  }

  return resumejson;
}
