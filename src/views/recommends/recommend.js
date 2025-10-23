import React from 'react';
// import { connect } from 'react-redux';
// import * as Actions from '../recommendActions';
// import 'react-dual-listbox/lib/react-dual-listbox.css';

// import { withTranslation } from 'react-i18next';
// import { compose } from 'redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';

function Recommend(props) {




    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                    }}
                    onSubmit={async (values) => {
                        await new Promise((r) => setTimeout(r, 500));
                        alert(JSON.stringify(values, null, 2));
                    }}
                >
                    <Form className="form form-label-right">
                        <div className="form-group row">
                            <div className="col-lg-12">
                                <label htmlFor="subject">عنوان پیشنهاد</label>
                                <input className="form-control" id="subject" name="subject"  />
                            </div>

                            <div className="col-lg-12">
                                <label htmlFor="description">شرح پیشنهاد</label>
                                <textarea className="form-control" id="description" name="description" />
                            </div>

                            <div className="col-lg-12">
                                <label htmlFor="description">تشریح وضعیت فعلی</label>
                                <textarea className="form-control" id="description" name="description" />
                            </div>


                            <div className="col-lg-12">
                                <label htmlFor="description">نتایج حاصل از اجرای پیشنهاد</label>
                                <textarea className="form-control" id="description" name="description" />
                            </div>

                            </div>


                      
                        <button type="submit">Submit</button>
                    </Form>
                </Formik>   </div>
        </div>
    )
}

export default Recommend;

// export default compose(
//     withTranslation(),
//     connect(state => state.recommned, Actions)
// )(Recommend);
