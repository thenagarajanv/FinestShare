import InternalNavbar from '@/app/_components/(NavigationBar)/InternalNavbar/page'
import React from 'react'

const page = () => {
  return (
    <div>
        <InternalNavbar/>
        <div className='outercontainer m-2 p-2'>
            <div className='innercontainer md:grid gap-3 grid-cols-2'>
                <div className='container-left'>
                  <label><h1 className='font-semi text-lg/6 font-extrabold m-2'>What is FinestShare? </h1></label>
                  <p className='m-2 text-justify'>
                    Splitwise is a Providence, RI-based company that makes it easy to split bills with friends and family. We organize all your shared expenses and IOUs in one place, so that everyone can see who they owe. Whether you are sharing a ski vacation, splitting rent with roommates, or paying someone back for lunch, Splitwise makes life easier. We store your data in the cloud so that you can access it anywhere: on iPhone, Android, or on your computer. We focus on fairness
                    Most people want to be fair to each other, but sometimes they forget, or can’t decide on what fair is. In addition to helping people honor their debts, we provide mediation advice about fairness issues through our “fairness calculators.” These calculators turn our crowdsourced data into a neutral fairness opinion about your personal situation.
                  </p>
                </div>
                <div className='contaienr-right'>
                
                </div>
            </div>
        </div>
    </div>
  )
}

export default page