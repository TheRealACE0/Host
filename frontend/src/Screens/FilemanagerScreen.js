import axios from "axios";
import { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import DownloadLink from "react-download-link";
const path = require("path");

const EditableFiles = [
    ".txt",
    ".properties",
    ".json",
    ".settings",
    ""
]

function FilemanagerScreen(props) {
    const [ FileDatas, setFileDatas ] = useState();

    const useLocationSearch = useLocation().search;
    const currentFolder = new URLSearchParams(useLocationSearch).get("folder");

    const history = useHistory();

    useState(() => {
        const getFiles = async () => {             
            axios.get("/filemanager/ls/" + props.match.params.id + "?folder=" + currentFolder)
                .then(response => {
                    if (response.data.Error) {
                        console.log(response.data.Error);
                    } else {
                        setFileDatas(response.data);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }

        getFiles();
    }, []);

    const getDataFromURL = (url) => new Promise((resolve, reject) => {
        setTimeout(() => {
            fetch(url)
                .then(response => response.text())
                .then(data => {resolve(data)});
        });
    }, 2000);

    return (
        <div className="card" style={{margin: 15}}>
            <div className="card-body">
                <div className="btn-space">
                    <Link to={"/container/" + props.match.params.id}><button className="btn btn-primary">Go back</button></Link>
                    {
                        currentFolder === "" ?
                            null
                        :
                            <button className="btn btn-primary" onClick={() => history.goBack()}><i className="bi bi-folder-symlink"></i></button>
                    }
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Filename</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            FileDatas ?
                                FileDatas.Directories.map((directory, i) => {
                                    return (
                                        <tr key={i}>
                                            <th>{directory}</th>
                                            <th>
                                                <button className="btn btn-primary" onClick={() => window.location.href = "/filemanager/" + props.match.params.id + "?folder=" + currentFolder + "/" + directory}>
                                                    <i className="bi bi-folder"></i>
                                                </button>
                                            </th>
                                        </tr>
                                    )
                                })
                            :
                                null
                        }
                        {
                            FileDatas ?
                                FileDatas.Files.map((file, i) => {
                                    return (
                                        <tr key={i}>
                                            <th>{file}</th>
                                            <th className="table-action-buttons">
                                                <DownloadLink label={<i className="btn btn-primary bi bi-download" style={{marginRight: 10}}></i>} style={{all: "unset"}} filename={file} exportFile={() => Promise.resolve(getDataFromURL("/filemanager/download/" + props.match.params.id + "?file=" + currentFolder + "/" + file))}></DownloadLink>
                                                
                                                {
                                                    EditableFiles.includes(path.extname(file)) ?
                                                        <Link to="/" className="btn btn-primary">
                                                            <i className="bi bi-code-slash"></i>
                                                        </Link>
                                                    : 
                                                        null
                                                }
                                            </th>
                                        </tr>
                                    )
                                })
                            :
                                <tr><th>Loading...</th></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default FilemanagerScreen;