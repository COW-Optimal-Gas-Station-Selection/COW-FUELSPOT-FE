import { Combobox, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { getBrands, getModels } from '../../../api/carService'
import ErrorMessage from '../atoms/ErrorMessage'
import Label from '../atoms/Label'

function CarInputSection({ brand, model, onBrandChange, onModelChange, error }) {
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])
    const [loadingBrands, setLoadingBrands] = useState(false)
    const [loadingModels, setLoadingModels] = useState(false)
    const [brandQuery, setBrandQuery] = useState('')
    const [modelQuery, setModelQuery] = useState('')

    // 브랜드 목록 조회
    useEffect(() => {
        setLoadingBrands(true)
        getBrands()
            .then(res => {
                const brandList = res.brands || []
                setBrands(brandList)
            })
            .catch(err => console.error('Failed to fetch brands:', err))
            .finally(() => setLoadingBrands(false))
    }, [])

    // 브랜드 선택 시 모델 목록 조회
    useEffect(() => {
        if (brand) {
            setLoadingModels(true)
            getModels(brand)
                .then(res => {
                    setModels(res || [])
                })
                .catch(err => console.error('Failed to fetch models:', err))
                .finally(() => setLoadingModels(false))
        } else {
            setModels([])
        }
    }, [brand])

    const filteredBrands = brandQuery === ''
        ? brands
        : brands.filter((b) => b.toLowerCase().includes(brandQuery.toLowerCase()))

    const filteredModels = modelQuery === ''
        ? models
        : models.filter((m) => m.modelName.toLowerCase().includes(modelQuery.toLowerCase()))

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 브랜드 선택 (Combobox) */}
                <div>
                    <Label className="text-gray-600 font-semibold mb-1.5 block text-xs px-1">자동차 제조사</Label>
                    <div className="relative">
                        <Combobox value={brand} onChange={onBrandChange}>
                            <div className="relative group">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <Combobox.Input
                                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 text-sm font-medium text-gray-700 placeholder:text-gray-300"
                                    placeholder={loadingBrands ? '로딩 중...' : '제조사 검색'}
                                    displayValue={(b) => b}
                                    onChange={(event) => setBrandQuery(event.target.value)}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                        <path d="M7 8l3 3 3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Combobox.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => setBrandQuery('')}
                            >
                                <Combobox.Options className="absolute z-30 mt-1 w-full bg-white shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black/5 overflow-auto focus:outline-none sm:text-sm border border-gray-100">
                                    {filteredBrands.length === 0 && brandQuery !== '' ? (
                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-400 text-xs text-center italic">
                                            검색 결과가 없습니다.
                                        </div>
                                    ) : (
                                        filteredBrands.map((b) => (
                                            <Combobox.Option
                                                key={b}
                                                className={({ active }) => `${active ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} cursor-pointer select-none relative py-2.5 px-4 transition-colors duration-150`}
                                                value={b}
                                            >
                                                {({ selected }) => (
                                                    <span className={`${selected ? 'font-bold text-blue-600' : 'font-medium'} block truncate px-2`}>{b}</span>
                                                )}
                                            </Combobox.Option>
                                        ))
                                    )}
                                </Combobox.Options>
                            </Transition>
                        </Combobox>
                    </div>
                </div>

                {/* 모델 선택 (Combobox) */}
                <div>
                    <Label className="text-gray-600 font-semibold mb-1.5 block text-xs px-1">자동차 모델</Label>
                    <div className="relative">
                        <Combobox value={model} onChange={onModelChange} disabled={!brand}>
                            <div className="relative group">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <Combobox.Input
                                    className={`w-full border rounded-xl py-3 pl-10 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 text-sm font-medium ${!brand ? 'bg-gray-50 border-gray-100 text-gray-300' : 'bg-white border-gray-200 text-gray-700 placeholder:text-gray-300'}`}
                                    placeholder={!brand ? '제조사 먼저 선택' : loadingModels ? '로딩 중...' : '모델명 검색'}
                                    displayValue={(m) => m?.modelName || ''}
                                    onChange={(event) => setModelQuery(event.target.value)}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                        <path d="M7 8l3 3 3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Combobox.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => setModelQuery('')}
                            >
                                <Combobox.Options className="absolute z-30 mt-1 w-full bg-white shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black/5 overflow-auto focus:outline-none sm:text-sm border border-gray-100">
                                    {filteredModels.length === 0 && modelQuery !== '' ? (
                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-400 text-xs text-center italic">
                                            검색 결과가 없습니다.
                                        </div>
                                    ) : (
                                        filteredModels.map((m) => (
                                            <Combobox.Option
                                                key={m.id}
                                                className={({ active }) => `${active ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} cursor-pointer select-none relative py-2.5 px-4 transition-colors duration-150`}
                                                value={m}
                                            >
                                                {({ selected }) => (
                                                    <div className="flex flex-col px-2">
                                                        <span className={`${selected ? 'font-bold text-blue-600' : 'font-medium'} block truncate`}>{m.modelName}</span>
                                                        <span className="text-[10px] text-gray-400">연비: {m.fuelEfficiency}km/L | {m.fuelType}</span>
                                                    </div>
                                                )}
                                            </Combobox.Option>
                                        ))
                                    )}
                                </Combobox.Options>
                            </Transition>
                        </Combobox>
                    </div>
                </div>
            </div>

            {/* 선택된 차 상세 정보 (깔끔한 버전) */}
            {model && (
                <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-4 flex items-center justify-between transition-all duration-300 animate-fadeIn">
                    <div>
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">선택된 차량</div>
                        <h2 className="text-base font-bold text-gray-800">{brand} {model.modelName}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-gray-500 font-medium">
                                {model.fuelType === 'GASOLINE' ? '휘발유' :
                                    model.fuelType === 'DIESEL' ? '경유' :
                                        model.fuelType === 'PREMIUM_GASOLINE' ? '고급휘발유' :
                                            model.fuelType === 'LPG' ? 'LPG' : model.fuelType}
                            </span>
                        </div>
                    </div>
                    <div className="text-right border-l border-gray-200 pl-4">
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-tight mb-0.5">복합 연비</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900">{model.fuelEfficiency}</span>
                            <span className="text-[10px] font-bold text-gray-400">km/L</span>
                        </div>
                    </div>
                </div>
            )}

            <ErrorMessage>{error}</ErrorMessage>
        </div>
    )
}

export default CarInputSection
