// tslint:disable:no-console

import { Express } from 'express'
import { Notebook, NotebookModel } from '../../model/Notebook'
import { Config } from '../../config'
import { getAuthMiddleware } from '../../middleware/Auth'
import { InternalServerError } from '../errors/Utils'

interface NotebookApiObject {
    notebook: Notebook
}

export function notebookHandler(app: Express, config: Config) {
    app.get('/api/notebook', getAuthMiddleware(config.publicKeyPem), async (_, res) => {
        try {
            let notebook = await NotebookModel.findOne({})
            if (notebook === null) {
                notebook = new NotebookModel({ text: 'I like improv comedy' })
                await notebook.save()
            }

            const returnValue: NotebookApiObject = {
                notebook: {
                    text: notebook.text
                }
            }

            res.send(returnValue)
        }
        catch (e) {
            InternalServerError(res, e, 'GET', '/api/notebook')
        }
    })

    app.put('/api/notebook', getAuthMiddleware(config.publicKeyPem), async (req, res) => {
        try {
            // TODO: Find a validation lib
            if (!req.body || !req.body.notebook || !req.body.notebook.text) {
                res.sendStatus(400)
                return
            }

            let notebook = await NotebookModel.findOne()
            if (notebook) {
                await NotebookModel.replaceOne({ _id: notebook._id }, req.body.notebook)
            }
            else {
                notebook = new NotebookModel({ text: req.body.notebook.text })
                await notebook.save()
            }

            res.sendStatus(200)
        } catch (e) {
            InternalServerError(res, e, 'PUT', '/api/notebook')
        }
    })
}
