


import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import React, { useState, useEffect } from "react"
import { gql, useQuery, useMutation } from '@apollo/client';
import Cardloader from '../component/loader';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import Skeleton from "react-loading-skeleton";


const GET_TODOS = gql`
{
    BookMarks {
        title
        id
        link
    }
}
`

const ADD_BOOKMARK = gql`
    mutation addBook($title: String! , $link : String!){
        addBook(title: $title , link : $link){
            title
            link
        }
    }
`
function Home() {
    const { loading, error, data } = useQuery(GET_TODOS);

    const [Loader, setLoader] = useState(false)

    useEffect(() => {
        return () => {
           
          setTimeout(() => {
              setLoader(false)
              
          }, 4000);
        
    }
    }, [ data ? Loader : null])

    const [addBook] = useMutation(ADD_BOOKMARK);






   console.log("data" , Loader)

    return (
        <div className="box">
            <nav className="navbar navbar-expand-sm navbar-dark " style={{ backgroundColor: '#000000' }}>
                <a className="navbar-brand" href="#">BookMark Application </a>
            </nav>

            <div className="center">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="head">BookMark Application with Gatsby GraphQl </h1>
                        </div>
                        <div className="col-lg-4">
                            <Formik
                                initialValues={{ title: "", link: "" }}
                                validationSchema={
                                    Yup.object().shape({
                                        title: Yup.string().max(10, "Above 10 charctor required").required("Title field is required"),
                                        link: Yup.string()
                                            .matches(
                                                /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                                                'Enter correct url!'
                                            )
                                            .required('Please enter website'),


                                    })
                                }
                                onSubmit={(values, { setSubmitting }) => {
                                    console.log(values);
                                    addBook({
                                        variables: {
                                            title: values.title,
                                            link: values.link
                                        },
                                        refetchQueries: [{ query: GET_TODOS }]
                                    })
                                    values.title = "";
                                    values.link = "";
                                    setLoader(true)


                                }}
                            >

                                {({

                                    setSubmitting, errors, touched
                                    /* and other goodies */
                                }) => (

                                        <Form>
                                            <div className="form">
                                                <div className="card-group">
                                                    <div className="card">
                                                        {/* <img className="card-img-top" src="https://homepages.cae.wisc.edu/~ece533/images/watch.png" style={{ height: '150px' }} alt="Card image cap" /> */}
                                                        <div className="card-body">
                                                            <div className="form-group">
                                                                <label htmlFor="">BookMark Tittle</label>
                                                                <Field type="text" name="title" id="" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} placeholder="Tittle" />
                                                                <ErrorMessage name="title" component="div" className="invalid-feedback" />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="link">BookMark Url</label>
                                                                <Field type="text" name="link" id="link" className={'form-control' + (errors.link && touched.link ? ' is-invalid' : '')} placeholder="Url" />
                                                                <ErrorMessage name="link" component="div" className="invalid-feedback" />

                                                            </div>
                                                            <div className="form-group">
                                                                <button className="btn btn-primary" type="submit" >Add Book</button>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </Form>
                                    )}
                            </Formik>




                        </div>


                    </div>
                    {loading && <Cardloader />}
                    {/* {Loader && <Cardloader />} */}


                    {error ? <h2 style={{ color: 'red' }}>Please Check Your Internet connection .......</h2> : null}
                    <div className="row">
                        {
                            Loader ? data.BookMarks.map((todo, index: number) => {
                                return (
                                    <div className="col-md-4" key={index} >
                                        <div className="form" >
                                            <div className="card-group">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="form-group">
                                                           
                                                            <label htmlFor=""> <Skeleton height={20} width={`50%`} style={{backgroundColor:'blue'}} /> </label>
                                                            <div className="linkName">
                                                                <h5><Skeleton width={`60%`} height={20} /></h5>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor=""><Skeleton height={20} width={`50%`} /></label>
                                                            <div className="BookLink">
                                                                <h4><a href={todo.link} target="_blank"><Skeleton width={`100%` } height={30} /></a></h4>
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>

                                            </div>
                                        </div>



                                    </div>
                                )
                            })
                                :
                                 !loading && data ? data.BookMarks.map((todo, index: number) => {
                                    return (

                                        <div className="col-md-4" key={index}>
                                            <div className="form" >
                                                <div className="card-group">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="form-group">
                                                                <label htmlFor="">BookMark Tittle</label>
                                                                <div className="linkName">
                                                                    <h5>{todo.title}</h5>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="">BookMark Url</label>
                                                                <div className="BookLink">
                                                                    <h4><a href={todo.link} target="_blank">{todo.link}</a></h4>
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>

                                                </div>
                                            </div>



                                        </div>
                                    )
                                })
                                    : null
                        }



                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home

