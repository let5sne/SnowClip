#!/usr/bin/env python3
"""生成简单的扩展图标"""
import struct
import zlib

def create_png(size, color=(102, 126, 234)):
    """创建简单的纯色 PNG 图标"""
    
    def chunk(chunk_type, data):
        return struct.pack('>I', len(data)) + chunk_type + data + struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
    
    # PNG signature
    signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    ihdr = chunk(b'IHDR', ihdr_data)
    
    # IDAT chunk (raw image data)
    raw_data = b''
    for y in range(size):
        raw_data += b'\x00'  # filter byte
        for x in range(size):
            # 创建圆角矩形效果
            cx, cy = size / 2, size / 2
            radius = size * 0.4
            corner_radius = size * 0.15
            
            # 简化：纯色填充
            raw_data += bytes(color)
    
    compressed = zlib.compress(raw_data, 9)
    idat = chunk(b'IDAT', compressed)
    
    # IEND chunk
    iend = chunk(b'IEND', b'')
    
    return signature + ihdr + idat + iend

# 生成不同尺寸的图标
for size in [16, 48, 128]:
    png_data = create_png(size)
    with open(f'icons/icon{size}.png', 'wb') as f:
        f.write(png_data)
    print(f'Generated icons/icon{size}.png')

print('Done!')
