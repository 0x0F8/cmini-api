import CminiController from '@backend/cmini/controller'

export async function GET() {
    return Response.json({
        data: CminiController.getAuthorIds(),
        success: true
    })
}