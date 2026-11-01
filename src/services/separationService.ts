export interface SeparationResult {
  status: string
  message: string
  job_id: string
  model: string
  vocals: string
  instrumental: string
}

const API_BASE_URL = 'http://127.0.0.1:8765'

export async function separateAudio(
  file: File,
  outputDirectory: string
): Promise<SeparationResult> {

  if (!file) {
    throw new Error('Please select an audio file.')
  }

  if (!outputDirectory.trim()) {
    throw new Error('Please select an output folder.')
  }

  const formData = new FormData()

  formData.append('file', file)
  formData.append('output_directory', outputDirectory)

  let response: Response

  try {
    response = await fetch(
      `${API_BASE_URL}/api/separate`,
      {
        method: 'POST',
        body: formData
      }
    )
  } catch {
    throw new Error(
      'Unable to connect to VocalSplit AI backend. Please ensure the backend is running.'
    )
  }

  if (!response.ok) {
    let errorMessage = 'Audio separation failed.'

    try {
      const error = await response.json()
      errorMessage = error.detail || errorMessage
    } catch {
      // Retain the default error message.
    }

    throw new Error(errorMessage)
  }

  return response.json() as Promise<SeparationResult>
}