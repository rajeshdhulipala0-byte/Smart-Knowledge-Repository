import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import knowledgeService from '../services/knowledgeService';
import { FiMapPin, FiLink, FiTwitter, FiGithub, FiLinkedin, FiBook, FiEye, FiBookmark } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userKnowledge, setUserKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // If it's the current user's profile, use their data
        if (isOwnProfile && currentUser) {
          setProfileUser(currentUser);
        }
        
        // Fetch user's knowledge
        const knowledgeResponse = await knowledgeService.getAll();
        const userKnowledgeList = knowledgeResponse.data.filter(
          (k) => k.createdBy?._id === userId || k.createdBy === userId
        );
        setUserKnowledge(userKnowledgeList);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfileData();
    }
  }, [userId, currentUser, isOwnProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profileUser && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
          <p className="text-gray-600 mt-2">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 fade-in">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profileUser?.avatar ? (
              <img
                src={`http://localhost:5000${profileUser.avatar}`}
                alt={profileUser.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-5xl font-bold">
                {profileUser?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-grow">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{profileUser?.name}</h1>
              {profileUser?.role === 'admin' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                  Admin
                </span>
              )}
            </div>

            {profileUser?.bio && (
              <p className="text-gray-600 mb-4 max-w-2xl">{profileUser.bio}</p>
            )}

            {/* Profile Details */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {profileUser?.location && (
                <div className="flex items-center space-x-1">
                  <FiMapPin className="text-gray-400" />
                  <span>{profileUser.location}</span>
                </div>
              )}
              {profileUser?.website && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-primary-600 hover:underline"
                >
                  <FiLink className="text-gray-400" />
                  <span>{profileUser.website}</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            {(profileUser?.social?.twitter || profileUser?.social?.linkedin || profileUser?.social?.github) && (
              <div className="flex items-center space-x-4 mt-4">
                {profileUser.social.twitter && (
                  <a
                    href={`https://twitter.com/${profileUser.social.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-600 transition"
                  >
                    <FiTwitter size={20} />
                  </a>
                )}
                {profileUser.social.linkedin && (
                  <a
                    href={profileUser.social.linkedin.startsWith('http') ? profileUser.social.linkedin : `https://${profileUser.social.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-600 transition"
                  >
                    <FiLinkedin size={20} />
                  </a>
                )}
                {profileUser.social.github && (
                  <a
                    href={profileUser.social.github.startsWith('http') ? profileUser.social.github : `https://${profileUser.social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-600 transition"
                  >
                    <FiGithub size={20} />
                  </a>
                )}
              </div>
            )}

            {/* Edit Profile Button */}
            {isOwnProfile && (
              <Link
                to="/settings"
                className="inline-block mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <FiBook className="mx-auto text-primary-600 mb-2" size={32} />
          <div className="text-3xl font-bold text-gray-800">{profileUser?.stats?.knowledgeCreated || userKnowledge.length}</div>
          <div className="text-gray-600">Knowledge Created</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <FiEye className="mx-auto text-green-600 mb-2" size={32} />
          <div className="text-3xl font-bold text-gray-800">{profileUser?.stats?.knowledgeViewed || 0}</div>
          <div className="text-gray-600">Items Viewed</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <FiBookmark className="mx-auto text-purple-600 mb-2" size={32} />
          <div className="text-3xl font-bold text-gray-800">{profileUser?.stats?.bookmarks || 0}</div>
          <div className="text-gray-600">Bookmarks</div>
        </div>
      </div>

      {/* Knowledge List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {isOwnProfile ? 'Your' : `${profileUser?.name}'s`} Knowledge Articles
        </h2>

        {userKnowledge.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No knowledge articles yet.</p>
            {isOwnProfile && (
              <Link
                to="/create"
                className="inline-block mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Create Your First Article
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userKnowledge.map((knowledge) => (
              <Link
                key={knowledge._id}
                to={`/knowledge/${knowledge._id}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {knowledge.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {knowledge.description || knowledge.content?.substring(0, 100)}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded">
                    {knowledge.category}
                  </span>
                  <span className="flex items-center space-x-1">
                    <FiEye size={12} />
                    <span>{knowledge.views || 0}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
