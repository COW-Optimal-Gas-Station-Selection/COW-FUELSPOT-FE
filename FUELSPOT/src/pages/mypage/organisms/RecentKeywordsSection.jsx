import { useEffect, useState } from 'react'
import { deleteAllKeywords, deleteKeyword, getRecentKeywords } from '../../../api/searchService'

function RecentKeywordsSection() {
    const [keywords, setKeywords] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadKeywords()
    }, [])

    const loadKeywords = async () => {
        try {
            setLoading(true)
            const data = await getRecentKeywords()
            // API 응답 구조에 따라 데이터 추출 (Set<String>이 배열로 변환되어 올 것으로 예상)
            setKeywords(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Failed to load recent keywords:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (keyword) => {
        try {
            await deleteKeyword(keyword)
            setKeywords(prev => prev.filter(k => k !== keyword))
        } catch (error) {
            alert('검색어 삭제 중 오류가 발생했습니다.')
        }
    }

    const handleDeleteAll = async () => {
        if (!confirm('모든 검색 기록을 삭제하시겠습니까?')) return
        try {
            await deleteAllKeywords()
            setKeywords([])
        } catch (error) {
            alert('전체 삭제 중 오류가 발생했습니다.')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">최근 검색어</h3>
                {keywords.length > 0 && (
                    <button
                        onClick={handleDeleteAll}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                        전체 삭제
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {keywords.length > 0 ? (
                    keywords.map((keyword, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 rounded-full border border-gray-200 hover:border-blue-200 transition-all cursor-default"
                        >
                            <span className="text-sm text-gray-600 group-hover:text-blue-600">{keyword}</span>
                            <button
                                onClick={() => handleDelete(keyword)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                                title="삭제"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 italic py-2">최근 검색 기록이 없습니다.</p>
                )}
            </div>
        </div>
    )
}

export default RecentKeywordsSection
