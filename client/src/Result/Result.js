import React, { useState, useEffect } from "react";

function Result({ res }) {
    const [ggasr, setGgasr] = useState('');
    const [time_cfm, setTime_cfm] = useState('');
    const [kaldi, setKaldi] = useState('');
    const [cfm, setCfm] = useState('');

    useEffect(() => {
        if (res) {
            // console.log(res);
            setCfm(res.cfm.transcript);
            setTime_cfm(res.cfm.time);
        }
    }, [res]);

    return (

        <div>
            <div className="row mt-4 pt-3 ">
                <h3 className="col-md-2">Model</h3>
                <h3 className="col-md-8 text-center">Transcript</h3>
                <h3 className="col-md-2">Time (s)</h3>
            </div>
            {res && (
                <div className="mt-2 pt-1">
                    <div className="row justify-content-sm-center overflow-auto">
                        <h4 className="col-2">Conformer</h4>
                        <div id="res" className="col-md-8">
                            <span className="align-middle"><h6>{cfm}</h6></span>
                        </div>
                        <p className="col-md-2 font-italic">{time_cfm}</p>
                    </div>

                    {/* <div className="row justify-content-sm-center overflow-auto">
                        <h4 className="col-md-2">Conformer</h4>
                        <div id="res" className="col-md-8 align-middle">
                            <p id="ggasr">{cfm}</p>
                        </div>
                        <p className="col-md-2 font-italic">{time_cfm}</p>
                    </div> */}
                    {/* <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" class="card-link">Card link</a>
                        <a href="#" class="card-link">Another link</a>
                    </div>
                </div> */}
                </div>
            )
            }
        </div>
    );
}

export default Result;