import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Banner, BannerOrientation } from '../../types';
import { defaultBanners } from '../../defaultData';
import { BANNERS_SQL_SCHEMA } from '../../services/supabaseService';
import { optimizeBannerImage } from '../../utils/imageOptimizer';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Code,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  RefreshCw,
  UploadCloud,
  FileCheck2,
  Info,
  X,
  Layers,
  SplitSquareVertical,
} from 'lucide-react';

interface Props {
  showToast: (msg: string) => void;
  requestDelete: (opts: {
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => Promise<void> | void;
  }) => void;
}

export const BannersManagementTab: React.FC<Props> = ({ showToast, requestDelete }) => {
  const {
    database,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerActive,
    uploadMedia,
  } = useData();

  const banners = database.banners && database.banners.length > 0 ? database.banners : defaultBanners;

  // Filter & Sorted Banners (Landscape first, then Portrait)
  const [filter, setFilter] = useState<'all' | 'landscape' | 'portrait'>('all');

  const sortedBanners = useMemo(() => {
    const landscapeList = banners
      .filter((b) => b.orientation === 'landscape')
      .sort((a, b) => (a.displayOrder ?? 1) - (b.displayOrder ?? 1));
    const portraitList = banners
      .filter((b) => b.orientation === 'portrait')
      .sort((a, b) => (a.displayOrder ?? 1) - (b.displayOrder ?? 1));

    return [...landscapeList, ...portraitList];
  }, [banners]);

  const displayedBanners = useMemo(() => {
    if (filter === 'all') return sortedBanners;
    return sortedBanners.filter((b) => b.orientation === filter);
  }, [sortedBanners, filter]);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState<{
    id?: string;
    title: string;
    imageUrl: string;
    imageUrl2?: string;
    title2?: string;
    linkUrl: string;
    linkUrl2?: string;
    orientation: BannerOrientation;
    displayOrder: number;
    isActive: boolean;
    fileSizeKb?: number;
    fileSizeKb2?: number;
  }>({
    title: '',
    imageUrl: '',
    imageUrl2: '',
    title2: '',
    orientation: 'landscape',
    linkUrl: '',
    linkUrl2: '',
    displayOrder: 1,
    isActive: true,
  });

  const [isOptimizing1, setIsOptimizing1] = useState(false);
  const [isOptimizing2, setIsOptimizing2] = useState(false);
  const [isOptimizingBatch, setIsOptimizingBatch] = useState(false);
  const [optimizationStats1, setOptimizationStats1] = useState<string | null>(null);
  const [optimizationStats2, setOptimizationStats2] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Supabase SQL Modal
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Live Admin Simulator State - Strictly 3-Second Non-Stopping Rotation (No Pause)
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewProgress, setPreviewProgress] = useState(0);

  const activeRotationBanners = useMemo(() => {
    return sortedBanners.filter((b) => b.isActive !== false);
  }, [sortedBanners]);

  // Strictly 3-Second rotation timer for Admin Simulator (Loops infinitely without stopping)
  useEffect(() => {
    if (activeRotationBanners.length <= 1) {
      setPreviewProgress(0);
      return;
    }

    setPreviewProgress(0);
    const stepTime = 50;
    const totalTime = 3000; // 3 seconds
    const increment = (stepTime / totalTime) * 100;

    const progressTimer = setInterval(() => {
      setPreviewProgress((prev) => (prev >= 100 ? 100 : prev + increment));
    }, stepTime);

    const rotationTimer = setTimeout(() => {
      setPreviewIndex((prev) => (prev + 1) % activeRotationBanners.length);
      setPreviewProgress(0);
    }, totalTime);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(rotationTimer);
    };
  }, [previewIndex, activeRotationBanners.length]);

  // Open Add Modal
  const handleOpenAdd = (defaultOrientation: BannerOrientation = 'landscape') => {
    setEditingBanner(null);
    setOptimizationStats1(null);
    setOptimizationStats2(null);
    setBannerForm({
      title: '',
      imageUrl: '',
      imageUrl2: '',
      title2: '',
      orientation: defaultOrientation,
      linkUrl: '',
      linkUrl2: '',
      displayOrder: banners.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setOptimizationStats1(banner.fileSizeKb ? `Left Image: ${banner.fileSizeKb} KB` : null);
    setOptimizationStats2(banner.fileSizeKb2 ? `Right Image: ${banner.fileSizeKb2} KB` : null);
    setBannerForm({
      id: banner.id,
      title: banner.title || '',
      imageUrl: banner.imageUrl,
      imageUrl2: banner.imageUrl2 || '',
      title2: banner.title2 || '',
      orientation: banner.orientation,
      linkUrl: banner.linkUrl || '',
      linkUrl2: banner.linkUrl2 || '',
      displayOrder: banner.displayOrder ?? 1,
      isActive: banner.isActive !== false,
      fileSizeKb: banner.fileSizeKb,
      fileSizeKb2: banner.fileSizeKb2,
    });
    setIsModalOpen(true);
  };

  // Compress Image 1 (or Landscape Image) to 40 KB - 60 KB
  const handleImage1Change = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizing1(true);
    setOptimizationStats1(null);

    try {
      const result = await optimizeBannerImage(file, bannerForm.orientation);
      const sizeKb = Math.round(result.stats.optimizedSize / 1024);

      setOptimizationStats1(
        `✓ ${result.stats.formattedOriginal} → ${result.stats.formattedOptimized} (${sizeKb} KB) [Target: 40–60 KB]`
      );

      let finalUrl = result.dataUrl || '';
      if (isSupabaseConfigured) {
        const uploadRes = await uploadMedia(result.file, 'gallery');
        if (uploadRes.success && uploadRes.url) {
          finalUrl = uploadRes.url;
        }
      }

      setBannerForm((prev) => ({
        ...prev,
        imageUrl: finalUrl,
        fileSizeKb: sizeKb,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
    } catch (err: any) {
      console.error('Image 1 compression error:', err);
      showToast('Compression error. Please try another image.');
    } finally {
      setIsOptimizing1(false);
    }
  };

  // Compress Image 2 (Right Portrait Image) to 40 KB - 60 KB
  const handleImage2Change = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizing2(true);
    setOptimizationStats2(null);

    try {
      const result = await optimizeBannerImage(file, 'portrait');
      const sizeKb = Math.round(result.stats.optimizedSize / 1024);

      setOptimizationStats2(
        `✓ ${result.stats.formattedOriginal} → ${result.stats.formattedOptimized} (${sizeKb} KB) [Target: 40–60 KB]`
      );

      let finalUrl = result.dataUrl || '';
      if (isSupabaseConfigured) {
        const uploadRes = await uploadMedia(result.file, 'gallery');
        if (uploadRes.success && uploadRes.url) {
          finalUrl = uploadRes.url;
        }
      }

      setBannerForm((prev) => ({
        ...prev,
        imageUrl2: finalUrl,
        fileSizeKb2: sizeKb,
        title2: prev.title2 || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
    } catch (err: any) {
      console.error('Image 2 compression error:', err);
      showToast('Compression error. Please try another image.');
    } finally {
      setIsOptimizing2(false);
    }
  };

  // Batch Upload 2 Portrait Images at Once
  const handleDualPortraitBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsOptimizingBatch(true);
    try {
      const file1 = files[0];
      const file2 = files.length > 1 ? files[1] : null;

      // Optimize file 1
      const res1 = await optimizeBannerImage(file1, 'portrait');
      const sizeKb1 = Math.round(res1.stats.optimizedSize / 1024);
      let url1 = res1.dataUrl || '';
      if (isSupabaseConfigured) {
        const up1 = await uploadMedia(res1.file, 'gallery');
        if (up1.success && up1.url) url1 = up1.url;
      }

      setOptimizationStats1(
        `Image 1 (Left): ${res1.stats.formattedOriginal} → ${res1.stats.formattedOptimized} (${sizeKb1} KB)`
      );

      let url2 = bannerForm.imageUrl2;
      let sizeKb2 = bannerForm.fileSizeKb2;

      // If file 2 was selected in the same dialog
      if (file2) {
        const res2 = await optimizeBannerImage(file2, 'portrait');
        sizeKb2 = Math.round(res2.stats.optimizedSize / 1024);
        url2 = res2.dataUrl || '';
        if (isSupabaseConfigured) {
          const up2 = await uploadMedia(res2.file, 'gallery');
          if (up2.success && up2.url) url2 = up2.url;
        }
        setOptimizationStats2(
          `Image 2 (Right): ${res2.stats.formattedOriginal} → ${res2.stats.formattedOptimized} (${sizeKb2} KB)`
        );
      }

      setBannerForm((prev) => ({
        ...prev,
        imageUrl: url1,
        fileSizeKb: sizeKb1,
        title: prev.title || file1.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        ...(file2
          ? {
              imageUrl2: url2,
              fileSizeKb2: sizeKb2,
              title2: prev.title2 || file2.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            }
          : {}),
      }));

      if (file2) {
        showToast('Both portrait images compressed & loaded successfully!');
      } else {
        showToast('Image 1 loaded. You can now select Image 2 for the right side.');
      }
    } catch (err: any) {
      console.error('Batch upload error:', err);
      showToast('Error uploading images. Please try again.');
    } finally {
      setIsOptimizingBatch(false);
    }
  };

  // Save Banner (Add or Update)
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.imageUrl) {
      showToast('Please upload or provide at least the primary banner image.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Banner> = {
        title: bannerForm.title.trim(),
        imageUrl: bannerForm.imageUrl,
        imageUrl2: bannerForm.orientation === 'portrait' ? (bannerForm.imageUrl2?.trim() || undefined) : undefined,
        title2: bannerForm.orientation === 'portrait' ? (bannerForm.title2?.trim() || undefined) : undefined,
        orientation: bannerForm.orientation,
        linkUrl: bannerForm.linkUrl.trim(),
        linkUrl2: bannerForm.orientation === 'portrait' ? (bannerForm.linkUrl2?.trim() || undefined) : undefined,
        displayOrder: Number(bannerForm.displayOrder) || 1,
        isActive: bannerForm.isActive,
        fileSizeKb: bannerForm.fileSizeKb,
        fileSizeKb2: bannerForm.orientation === 'portrait' ? bannerForm.fileSizeKb2 : undefined,
      };

      if (editingBanner?.id) {
        await updateBanner(editingBanner.id, payload);
        showToast('Banner updated successfully.');
      } else {
        await addBanner({
          title: payload.title || '',
          imageUrl: payload.imageUrl!,
          imageUrl2: payload.imageUrl2,
          title2: payload.title2,
          orientation: payload.orientation || 'landscape',
          linkUrl: payload.linkUrl,
          linkUrl2: payload.linkUrl2,
          displayOrder: payload.displayOrder || banners.length + 1,
          isActive: payload.isActive !== false,
          fileSizeKb: payload.fileSizeKb,
          fileSizeKb2: payload.fileSizeKb2,
        });
        showToast('New banner added and published to front page.');
      }
      setIsModalOpen(false);
      setEditingBanner(null);
    } catch (err: any) {
      showToast(err?.message || 'Failed to save banner.');
    } finally {
      setIsSaving(false);
    }
  };

  const copySqlCode = () => {
    navigator.clipboard.writeText(BANNERS_SQL_SCHEMA);
    setSqlCopied(true);
    showToast('Supabase SQL Schema copied to clipboard!');
    setTimeout(() => setSqlCopied(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
              BANNERS MANAGEMENT
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1.5 leading-relaxed max-w-2xl">
            Front-page rotating 3-second continuous banners. Plays all <strong className="text-emerald-400">Landscape Banners</strong> first, then <strong className="text-indigo-400">Portrait Banner Pairs (2 images side-by-side filling entire space)</strong> in a non-stopping infinite loop. Automatically compressed to <strong>40 KB – 60 KB</strong> each for Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Supabase SQL Button */}
          <button
            type="button"
            onClick={() => setShowSqlModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 shadow-xs transition-colors cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>Supabase SQL Table</span>
          </button>

          {/* + Upload New Banner Button */}
          <button
            type="button"
            onClick={() => handleOpenAdd('landscape')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-950 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Banner</span>
          </button>
        </div>
      </div>

      {/* Overview Cards & Rotation Policy Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total & Landscape First Rule */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-mono uppercase text-[11px]">ROTATION TIMING</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[10px] font-bold">
              3s CONTINUOUS
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {banners.length} <span className="text-xs font-normal text-stone-400">Total Banners</span>
          </div>
          <div className="text-xs text-stone-400 flex items-center gap-1.5 pt-1 border-t border-stone-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>1. Landscape First ({banners.filter((b) => b.orientation === 'landscape').length})</span>
            <span className="text-stone-600">→</span>
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>2. Portrait Pairs ({banners.filter((b) => b.orientation === 'portrait').length})</span>
          </div>
        </div>

        {/* Card 2: 40 KB - 60 KB Compression Target */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-mono uppercase text-[11px]">SUPABASE STORAGE SPEC</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/80 text-[10px] font-bold">
              40–60 KB TARGET
            </span>
          </div>
          <div className="text-base font-bold text-amber-400 font-mono">
            Ultra-Light Canvas Optimizer
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed border-t border-stone-800 pt-1">
            Uploaded images are automatically scaled & compressed to 40–60 KB sweet spot for instant load speed.
          </p>
        </div>

        {/* Card 3: Supabase Sync Status */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-mono uppercase text-[11px]">DATABASE TABLE</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL FALLBACK'}
            </span>
          </div>
          <div className="text-xs font-mono text-stone-300">
            Table: <code className="text-emerald-400">public.banners</code>
          </div>
          <div className="pt-1 border-t border-stone-800 flex items-center justify-between">
            <span className="text-[11px] text-stone-400">Includes Dual Portrait cols</span>
            <button
              onClick={() => setShowSqlModal(true)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
            >
              View SQL Schema →
            </button>
          </div>
        </div>
      </div>

      {/* Live Admin Simulator (3-Second Carousel Preview - Non-Stopping) */}
      {activeRotationBanners.length > 0 && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                LIVE 3-SECOND ROTATOR PREVIEW (SIMULATOR)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-stone-800 text-emerald-400 font-mono text-[11px] border border-stone-700">
                Continuous 3s Auto-Advance
              </span>
              <span className="font-mono text-stone-400">
                {previewIndex + 1} / {activeRotationBanners.length}
              </span>
            </div>
          </div>

          {/* Simulator Box */}
          {activeRotationBanners[previewIndex] && (
            <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-black border border-stone-800 flex items-center justify-center">
              {activeRotationBanners[previewIndex].orientation === 'portrait' ? (
                /* Portrait Banner: 2 images displayed side-by-side filling entire space */
                <div className="relative w-full h-full grid grid-cols-2 overflow-hidden bg-stone-950 divide-x divide-stone-800">
                  <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                    <img
                      src={activeRotationBanners[previewIndex].imageUrl}
                      alt="Portrait Left"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                    <img
                      src={
                        activeRotationBanners[previewIndex].imageUrl2 ||
                        activeRotationBanners[previewIndex].imageUrl
                      }
                      alt="Portrait Right"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              ) : (
                /* Landscape Banner */
                <img
                  src={activeRotationBanners[previewIndex].imageUrl}
                  alt={activeRotationBanners[previewIndex].title || 'Landscape Banner'}
                  className="w-full h-full object-cover object-center"
                />
              )}

              {/* Badges on simulator */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shadow ${
                    activeRotationBanners[previewIndex].orientation === 'landscape'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-indigo-700 text-white'
                  }`}
                >
                  {activeRotationBanners[previewIndex].orientation === 'landscape'
                    ? 'LANDSCAPE'
                    : 'PORTRAIT PAIR (2 IMAGES)'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-black/70 text-stone-300 backdrop-blur-xs font-mono">
                  Slide {previewIndex + 1} of {activeRotationBanners.length}
                </span>
              </div>

              {/* Progress line (3 Seconds) */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-stone-900">
                <div
                  className="h-full bg-emerald-500 transition-all duration-75 ease-linear"
                  style={{ width: `${previewProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            All Banners ({banners.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('landscape')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'landscape'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Landscape ({banners.filter((b) => b.orientation === 'landscape').length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('portrait')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'portrait'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Portrait Pairs ({banners.filter((b) => b.orientation === 'portrait').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenAdd('landscape')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Landscape</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAdd('portrait')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/80 transition-colors cursor-pointer"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>+ Add Portrait Pair</span>
          </button>
        </div>
      </div>

      {/* Banners Grid / List */}
      {displayedBanners.length === 0 ? (
        <div className="bg-stone-900/60 border border-dashed border-stone-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-800 text-stone-400 mx-auto flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Banners in this Category</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto leading-relaxed">
              Upload landscape or portrait banners. Portrait banners display 2 images side-by-side with no empty side gaps. All images are compressed to 40–60 KB.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleOpenAdd('landscape')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow cursor-pointer transition-colors"
            >
              + Upload Landscape Banner
            </button>
            <button
              type="button"
              onClick={() => handleOpenAdd('portrait')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow cursor-pointer transition-colors"
            >
              + Upload Portrait Pair
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedBanners.map((banner, index) => {
            const isLandscape = banner.orientation === 'landscape';

            return (
              <div
                key={banner.id}
                className="bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-2xl overflow-hidden flex flex-col transition-all shadow-md group"
              >
                {/* Banner Thumbnail Frame */}
                <div className="relative w-full h-44 sm:h-48 bg-black overflow-hidden flex items-center justify-center">
                  {isLandscape ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || 'Banner'}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    /* Portrait Banner: 2 images displayed side-by-side */
                    <div className="relative w-full h-full grid grid-cols-2 bg-stone-950 overflow-hidden divide-x divide-stone-800">
                      <img
                        src={banner.imageUrl}
                        alt="Left Portrait"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                      <img
                        src={banner.imageUrl2 || banner.imageUrl}
                        alt="Right Portrait"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Orientation Badge */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider shadow border ${
                        isLandscape
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80'
                          : 'bg-indigo-950/90 text-indigo-300 border-indigo-700/80'
                      }`}
                    >
                      {isLandscape ? '1. LANDSCAPE' : '2. PORTRAIT (2 IMAGES)'}
                    </span>

                    {(banner.fileSizeKb || banner.fileSizeKb2) && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/75 text-amber-300 border border-amber-800/70 shadow">
                        {banner.fileSizeKb ? `${banner.fileSizeKb} KB` : ''}
                        {banner.fileSizeKb2 ? ` + ${banner.fileSizeKb2} KB` : ''}
                      </span>
                    )}
                  </div>

                  {/* Active / Inactive Badge */}
                  <div className="absolute top-2.5 right-2.5 z-20">
                    <button
                      type="button"
                      onClick={() => toggleBannerActive(banner.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
                        banner.isActive !== false
                          ? 'bg-emerald-950/90 text-emerald-400 border-emerald-700/80'
                          : 'bg-stone-900/90 text-stone-400 border-stone-700'
                      }`}
                      title="Click to toggle active state on front page"
                    >
                      {banner.isActive !== false ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                      <span>{banner.isActive !== false ? 'Live' : 'Hidden'}</span>
                    </button>
                  </div>
                </div>

                {/* Banner Content Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {banner.title || (isLandscape ? '(Untitled Landscape)' : 'Portrait Pair')}
                      </h4>
                      <span className="text-[10px] font-mono text-stone-500 shrink-0">
                        Seq #{banner.displayOrder ?? index + 1}
                      </span>
                    </div>

                    {!isLandscape && banner.title2 && (
                      <p className="text-xs text-stone-400 line-clamp-1">
                        Right Image: {banner.title2}
                      </p>
                    )}

                    {banner.linkUrl ? (
                      <a
                        href={banner.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 line-clamp-1"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{banner.linkUrl}</span>
                      </a>
                    ) : (
                      <p className="text-[11px] text-stone-500 italic">No link attached</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      {/* Move Up/Down Order */}
                      <button
                        type="button"
                        onClick={async () => {
                          const newOrder = Math.max(1, (banner.displayOrder ?? 1) - 1);
                          await updateBanner(banner.id, { displayOrder: newOrder });
                          showToast('Order moved up.');
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer transition-colors"
                        title="Move Up in Rotation Order"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          const newOrder = (banner.displayOrder ?? 1) + 1;
                          await updateBanner(banner.id, { displayOrder: newOrder });
                          showToast('Order moved down.');
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer transition-colors"
                        title="Move Down in Rotation Order"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(banner)}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          requestDelete({
                            title: 'Delete Banner',
                            message: `Are you sure you want to delete "${banner.title || 'this banner'}"? It will be permanently removed from the front-page rotator.`,
                            confirmLabel: 'Delete Banner',
                            onConfirm: async () => {
                              await deleteBanner(banner.id, banner.imageUrl);
                              showToast('Banner deleted successfully.');
                            },
                          });
                        }}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/70 cursor-pointer transition-colors"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL 1: ADD / EDIT BANNER ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  {editingBanner ? 'Edit Banner' : 'Upload Front-Page Banner'}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Select orientation, upload images (auto-compressed to 40–60 KB each), and publish.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-5">
              {/* 2 OPTIONS AS REQUESTED: 1. LANDSCAPE IMAGE, 2. PORTRAIT IMAGE */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Select Banner Format & Orientation <span className="text-emerald-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* OPTION 1: LANDSCAPE IMAGE */}
                  <button
                    type="button"
                    onClick={() => setBannerForm((prev) => ({ ...prev, orientation: 'landscape' }))}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      bannerForm.orientation === 'landscape'
                        ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-500 text-white'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-850 hover:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold font-mono">1. LANDSCAPE IMAGE</span>
                      {bannerForm.orientation === 'landscape' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="mt-2 text-[11px] text-stone-300/90 leading-tight">
                      Widescreen banner. <strong>Plays first</strong> in front page 3s rotator.
                    </div>
                  </button>

                  {/* OPTION 2: PORTRAIT IMAGE (2 IMAGES PAIR) */}
                  <button
                    type="button"
                    onClick={() => setBannerForm((prev) => ({ ...prev, orientation: 'portrait' }))}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      bannerForm.orientation === 'portrait'
                        ? 'bg-indigo-950/80 border-indigo-500 shadow-md ring-1 ring-indigo-500 text-white'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-850 hover:text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold font-mono">2. PORTRAIT (2 IMAGES PAIR)</span>
                      {bannerForm.orientation === 'portrait' && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <div className="mt-2 text-[11px] text-stone-300/90 leading-tight">
                      <strong>2 images side-by-side</strong>. Fills full width with zero side gaps.
                    </div>
                  </button>
                </div>
              </div>

              {/* ================= CONDITION A: LANDSCAPE UPLOAD ================= */}
              {bannerForm.orientation === 'landscape' && (
                <div className="space-y-3 p-4 rounded-xl bg-stone-950 border border-stone-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-stone-300">
                      Landscape Image File <span className="text-amber-400 font-mono text-[10px]">(Target: 40–60 KB)</span>
                    </label>
                  </div>

                  <div className="border-2 border-dashed border-stone-700 hover:border-emerald-500 rounded-xl p-4 text-center bg-stone-900/60 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage1Change}
                      className="hidden"
                      id="landscape-file-input"
                      disabled={isOptimizing1}
                    />
                    <label
                      htmlFor="landscape-file-input"
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                    >
                      {isOptimizing1 ? (
                        <div className="flex items-center gap-2 text-xs text-amber-400">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Compressing image to 40–60 KB...</span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-6 h-6 text-emerald-400" />
                          <span className="text-xs text-stone-300 font-semibold">
                            Click to browse landscape image or drag & drop
                          </span>
                          <span className="text-[10px] text-stone-500">
                            Automatic 40–60 KB compression for lightning load
                          </span>
                        </>
                      )}
                    </label>
                  </div>

                  {optimizationStats1 && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-[11px] text-emerald-300 flex items-center gap-2">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{optimizationStats1}</span>
                    </div>
                  )}

                  {/* Direct URL fallback */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                      Or Direct Image URL
                    </label>
                    <input
                      type="url"
                      value={bannerForm.imageUrl}
                      onChange={(e) => setBannerForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://... image link"
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-hidden focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {/* Landscape Preview */}
                  {bannerForm.imageUrl && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black border border-stone-800">
                      <img
                        src={bannerForm.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-center"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-stone-300 border border-stone-700">
                        Landscape Preview
                      </span>
                    </div>
                  )}

                  {/* Title & Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Banner Title <span className="text-stone-500 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Annual Convocation 2026"
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Target Link / URL <span className="text-stone-500 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={bannerForm.linkUrl}
                        onChange={(e) => setBannerForm((prev) => ({ ...prev, linkUrl: e.target.value }))}
                        placeholder="https://... or #programs"
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= CONDITION B: DUAL PORTRAIT UPLOAD (2 IMAGES PAIR) ================= */}
              {bannerForm.orientation === 'portrait' && (
                <div className="space-y-4 p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/40 pb-2.5">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 font-mono">
                        <SplitSquareVertical className="w-4 h-4 text-indigo-400" />
                        DUAL PORTRAIT PAIR (LEFT & RIGHT)
                      </span>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Both portrait images display side-by-side filling 100% of the screen with zero side margins.
                      </p>
                    </div>

                    {/* Batch upload button: select 2 files at once */}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleDualPortraitBatchUpload}
                        className="hidden"
                        id="dual-portrait-batch-input"
                        disabled={isOptimizingBatch}
                      />
                      <label
                        htmlFor="dual-portrait-batch-input"
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow transition-colors"
                      >
                        {isOptimizingBatch ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UploadCloud className="w-3.5 h-3.5" />
                        )}
                        <span>Select 2 Images At Once</span>
                      </label>
                    </div>
                  </div>

                  {/* 2 Portrait Dropzones (Left Image & Right Image) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* LEFT IMAGE (Image 1) */}
                    <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          Image 1: Left Portrait <span className="text-emerald-400">*</span>
                        </span>
                        {bannerForm.fileSizeKb && (
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                            {bannerForm.fileSizeKb} KB
                          </span>
                        )}
                      </div>

                      <div className="border border-dashed border-stone-700 hover:border-emerald-500 rounded-lg p-3 text-center bg-stone-900/50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImage1Change}
                          className="hidden"
                          id="portrait-file-1"
                          disabled={isOptimizing1}
                        />
                        <label
                          htmlFor="portrait-file-1"
                          className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                        >
                          {isOptimizing1 ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                          ) : (
                            <UploadCloud className="w-5 h-5 text-emerald-400" />
                          )}
                          <span className="text-[11px] text-stone-300 font-semibold">
                            {bannerForm.imageUrl ? 'Change Left Image' : 'Upload Left Portrait'}
                          </span>
                          <span className="text-[9px] text-stone-500">Auto 40–60 KB</span>
                        </label>
                      </div>

                      {optimizationStats1 && (
                        <p className="text-[10px] text-emerald-400 line-clamp-1">{optimizationStats1}</p>
                      )}

                      <div>
                        <input
                          type="url"
                          value={bannerForm.imageUrl}
                          onChange={(e) => setBannerForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                          placeholder="Or Left Image URL"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-white placeholder-stone-600 focus:outline-hidden font-mono"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={bannerForm.title}
                          onChange={(e) => setBannerForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Left Title / Label (Optional)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-white placeholder-stone-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={bannerForm.linkUrl}
                          onChange={(e) => setBannerForm((prev) => ({ ...prev, linkUrl: e.target.value }))}
                          placeholder="Left Click Link (Optional)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-white placeholder-stone-600 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* RIGHT IMAGE (Image 2) */}
                    <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-400" />
                          Image 2: Right Portrait <span className="text-indigo-400">*</span>
                        </span>
                        {bannerForm.fileSizeKb2 && (
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
                            {bannerForm.fileSizeKb2} KB
                          </span>
                        )}
                      </div>

                      <div className="border border-dashed border-stone-700 hover:border-indigo-500 rounded-lg p-3 text-center bg-stone-900/50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImage2Change}
                          className="hidden"
                          id="portrait-file-2"
                          disabled={isOptimizing2}
                        />
                        <label
                          htmlFor="portrait-file-2"
                          className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                        >
                          {isOptimizing2 ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                          ) : (
                            <UploadCloud className="w-5 h-5 text-indigo-400" />
                          )}
                          <span className="text-[11px] text-stone-300 font-semibold">
                            {bannerForm.imageUrl2 ? 'Change Right Image' : 'Upload Right Portrait'}
                          </span>
                          <span className="text-[9px] text-stone-500">Auto 40–60 KB</span>
                        </label>
                      </div>

                      {optimizationStats2 && (
                        <p className="text-[10px] text-indigo-400 line-clamp-1">{optimizationStats2}</p>
                      )}

                      <div>
                        <input
                          type="url"
                          value={bannerForm.imageUrl2 || ''}
                          onChange={(e) => setBannerForm((prev) => ({ ...prev, imageUrl2: e.target.value }))}
                          placeholder="Or Right Image URL"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-white placeholder-stone-600 focus:outline-hidden font-mono"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={bannerForm.title2 || ''}
                          onChange={(e) => setBannerForm((prev) => ({ ...prev, title2: e.target.value }))}
                          placeholder="Right Title / Label (Optional)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-white placeholder-stone-600 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={bannerForm.linkUrl2 || ''}
                          onChange={(e) => setBannerForm((prev) => ({ ...prev, linkUrl2: e.target.value }))}
                          placeholder="Right Click Link (Optional)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-white placeholder-stone-600 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dual Portrait Live Preview side-by-side */}
                  {(bannerForm.imageUrl || bannerForm.imageUrl2) && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-stone-400">
                        Side-by-Side Dual Portrait Live Preview:
                      </span>
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black border border-stone-800 grid grid-cols-2 divide-x divide-stone-800">
                        <div className="relative w-full h-full flex items-center justify-center bg-stone-950">
                          {bannerForm.imageUrl ? (
                            <img
                              src={bannerForm.imageUrl}
                              alt="Left preview"
                              className="w-full h-full object-cover object-center"
                            />
                          ) : (
                            <span className="text-xs text-stone-600">No Left Image</span>
                          )}
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-mono bg-black/80 text-emerald-400 border border-emerald-800/80">
                            Left Image
                          </span>
                        </div>

                        <div className="relative w-full h-full flex items-center justify-center bg-stone-950">
                          {bannerForm.imageUrl2 ? (
                            <img
                              src={bannerForm.imageUrl2}
                              alt="Right preview"
                              className="w-full h-full object-cover object-center"
                            />
                          ) : (
                            <span className="text-xs text-stone-600">No Right Image</span>
                          )}
                          <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded text-[9px] font-mono bg-black/80 text-indigo-400 border border-indigo-800/80">
                            Right Image
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Order & Active Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Display Order Sequence
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bannerForm.displayOrder}
                    onChange={(e) =>
                      setBannerForm((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bannerForm.isActive}
                      onChange={(e) => setBannerForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 bg-stone-900 border-stone-700"
                    />
                    <span className="text-xs text-stone-200 font-semibold">
                      Publish on Front Page
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving || isOptimizing1 || isOptimizing2 || isOptimizingBatch}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow flex items-center gap-1.5 cursor-pointer"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{editingBanner ? 'Save Changes' : 'Publish Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: SUPABASE SQL SCHEMA ================= */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  Supabase BANNERS Table SQL Schema
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Execute this SQL in Supabase SQL Editor. Supports dual portrait columns with automatic table upgrade.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                How to use in Supabase:
              </p>
              <ol className="list-decimal list-inside text-[11px] text-stone-300 space-y-0.5 pl-1">
                <li>Log in to your Supabase project dashboard.</li>
                <li>Click <strong>SQL Editor</strong> in the left sidebar.</li>
                <li>Click <strong>New Query</strong>, paste the SQL below, and click <strong>Run</strong>.</li>
              </ol>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 text-xs font-mono overflow-x-auto max-h-80 leading-relaxed">
                {BANNERS_SQL_SCHEMA}
              </pre>

              <button
                type="button"
                onClick={copySqlCode}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {sqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{sqlCopied ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-800">
              <span className="text-[11px] text-stone-500 font-mono">
                Supports: id, title, image_url, image_url_2, title_2, orientation, link_url, link_url_2, display_order, is_active, file_size_kb, file_size_kb_2
              </span>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
