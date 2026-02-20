import React from 'react'
import {CTAButton} from "../HomePage/Button"
import { HighlightText } from './HighlightText'
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'
export const CodeBlocks = ({
    position,heading,subheading,ctabtn1,ctabtn2,codeblock,backgroundGradient,codecolor
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>

    {/*Section 1 */}
    <div className='w-[50%] flex flex-col gap-8 '>
        {heading}
        <div className='text-[#838894] font-bold'>
            {subheading}
        </div>
        <div className='flex gap-7 mt-7'>
            <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                <div className='flex gap-2 items-center'>
                    {ctabtn1.btnText}
                    <FaArrowRight/>
                </div>
            </CTAButton>
            <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                
                    {ctabtn2.btnText}
                
            </CTAButton>
        </div>
    </div>
    {/*Section 2*/}
    <div className='h-fit code-border relative text-10[px] w-[100%] py-4 flex flex-row lg:w-[500px] bg-[#0E1A2D3D]'>
        {/*HM:BG-GRADIENT */}
        <div className={`${backgroundGradient} absolute`}></div>
        <div className='text-center flex flex-col w-[10%] text-[#6E727F] font-inter font-bold'>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
        </div>
        <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codecolor} pr-2`}>
            <TypeAnimation
            sequence={[codeblock,10000,""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true}
            className=''
            style={
                {
                    whiteSpace:"pre-line",
                    display:"block",
                }   
            }
            />
        </div>
    </div>
    </div>
  )
}
