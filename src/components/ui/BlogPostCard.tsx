import Image from 'next/image';
import React from 'react';

interface BlogPostCardProps {
  title: string;
  summary: string;
  imageUrl: string;
  postUrl: string;
  viewCount: number;
  commentCount: number;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  title,
  summary,
  imageUrl,
  postUrl,
  viewCount,
  commentCount
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col m-3" style={{ maxWidth: '380px' }}>
      <div className="h-64 overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={title} 
          width={400} 
          height={300}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-[#52A4DB] mb-2">{title}</h3>
        <p className="text-sm text-[#555555] mb-5 leading-tight">{summary}</p>
        <div className="mt-auto">
          <a 
            href={postUrl} 
            className="bg-[#0B5394] text-white text-center py-3 px-4 rounded-md inline-block w-full font-bold text-lg hover:bg-opacity-90 transition-all"
          >
            SAIBA MAIS
          </a>
          <div className="flex justify-between items-center mt-4 text-xs text-gray-500 pt-3 border-t border-gray-200">
            <span>{viewCount} visualizações</span>
            <span>{commentCount} comentários</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
