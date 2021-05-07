import React from 'react'
import { Switch } from 'react-router-dom'

import RouteHandler from '../components/RouteHandler'

import ManagerHome from '../pages/Manager/ManagerHome'
import SignIn from '../pages/SignIn'
import NotFound from '../pages/NotFound'

// Forms and Lists
import ProducerForm from '../pages/Manager/ProducerForm'
import ProducerListPage from '../pages/Manager/ProducerListPage'
import ActivityForm from '../pages/Manager/ActivityForm'
import ActivityList from '../pages/Manager/ActivityList'
import ProductForm from '../pages/Manager/ProductForm'
import ProductList from '../pages/Manager/ProductList'
import ProducerDetails from '../pages/Manager/ProducerDetails'

const Routes = () => {
    return (
        <Switch>
            <RouteHandler exact path='/'>
                <SignIn />
            </RouteHandler>

            <RouteHandler private path='/home'>
                <ManagerHome />
            </RouteHandler>

            <RouteHandler private path='/producer-form'>
                <ProducerForm />
            </RouteHandler>

            <RouteHandler private path='/producer-list'>
                <ProducerListPage />
            </RouteHandler>

            <RouteHandler private path='/producer-details'>
                <ProducerDetails />
            </RouteHandler>

            <RouteHandler private path='/product-form'>
                <ProductForm />
            </RouteHandler>

            <RouteHandler private path='/product-list'>
                <ProductList />
            </RouteHandler>

            <RouteHandler private path='/activity-form'>
                <ActivityForm />
            </RouteHandler>

            <RouteHandler private path='/activity-list'>
                <ActivityList />
            </RouteHandler>

            <RouteHandler path='*'>
                <NotFound />
            </RouteHandler>
        </Switch>
    )
}

export default Routes