import React from 'react'
import { managerContext } from '../../App.js'

function DeleteRecord({ recordId }) {
    const context = React.useContext(managerContext)
    const deleteRecordHandler = recordID2del => {
        // delete record handler,
        // send a POST request to backend server, ask to remove the record with the given ID,
        // then update the table of this user

        // make sure that the user waht to delete:
        fetch('/remove-record', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recordID2del)
        }).then(res => res.json())
            .then(data => context.setDb(data))

        // remove black screen
        document.getElementsByClassName("modal-backdrop fade show")[0].remove()
    }


    return (<div>
        <button type="button" class="btn btn-danger btn-sm m-1"
            data-toggle="modal" data-target="#deleteModal">
            <img alt="remove record icon" src="/API/passwordsKepper/static/trash.png" /></button>
        <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Delete Post?</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <form onSubmit={e => e.preventDefault()}>
                            <input class="btn btn-danger" type="submit" onClick={() => deleteRecordHandler(recordId)} value="Delete" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div >)
}

export default React.memo(DeleteRecord)
